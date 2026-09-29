import crypto from 'crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { OrderItem } from '../models/OrderItem.js';
import { Coupon } from '../models/Coupon.js';
import { Payment } from '../models/Payment.js';
import { Address } from '../models/Address.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateOrderTotals } from '../utils/calculateTotals.js';
import { buildInvoicePdf } from '../utils/invoice.js';
import { createRazorpayOrder } from '../services/paymentService.js';

function buildOrderNumber() {
  return `ZAIKA-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function getRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY || '';
}

async function hydrateCartItems(userId, items = []) {
  const resolved = [];
  for (const item of items) {
    const productKey = item.product?._id || item.product;
    let product = null;
    if (mongoose.isValidObjectId(productKey)) {
      product = await Product.findById(productKey).populate('category');
    }
    if (!product) {
      product = await Product.findOne({ slug: productKey }).populate('category');
    }
    if (!product) {
      product = await Product.findOne({ name: productKey }).populate('category');
    }
    if (!product) continue;
    resolved.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: product.discountedPrice || product.price,
      quantity: item.quantity
    });
  }

  return resolved;
}

export const createOrder = asyncHandler(async (req, res) => {
  console.log('createOrder: user=', req.user?._id, 'body=', req.body);
  const body = z.object({
    items: z.array(z.object({ product: z.string().min(1), quantity: z.number().min(1) })).optional(),
    addressId: z.string().optional(),
    shippingAddress: z.object({
      fullName: z.string().min(2),
      phone: z.string().min(6),
      addressLine1: z.string().min(3),
      addressLine2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      pinCode: z.string().min(4),
      landmark: z.string().optional()
    }).optional(),
    paymentMethod: z.enum(['cod', 'razorpay']).default('cod'),
    couponCode: z.string().optional(),
    notes: z.string().optional()
  }).parse(req.body);

  const user = await User.findById(req.user._id).populate('cartItems.product');
  // prefer server-side cartItems, but fall back to items passed in the request body
  let items = [];
  if (user && user.cartItems && user.cartItems.length) {
    items = await hydrateCartItems(req.user._id, user.cartItems);
  } else if (body.items && Array.isArray(body.items) && body.items.length) {
    // hydrate items from provided payload (product id strings)
    items = await hydrateCartItems(req.user._id, body.items.map((it) => ({ product: it.product, quantity: it.quantity })));
  }

  if (!items.length) {
    console.warn('createOrder: no items after hydration, payload items:', body.items);
    throw new AppError('Cart is empty', 400);
  }
  const deliveryFee = 49;
  let coupon = null;
  const totals = calculateOrderTotals(items, deliveryFee);

  if (body.couponCode) {
    coupon = await Coupon.findOne({ code: body.couponCode.toUpperCase(), isActive: true });
    if (coupon && coupon.minimumOrderAmount <= totals.subtotal) {
      if (coupon.discountType === 'percentage') {
        const discount = Math.min(
          (totals.subtotal * coupon.discountValue) / 100,
          coupon.maxDiscountAmount || Number.MAX_SAFE_INTEGER
        );
        totals.total = Number((totals.total - discount).toFixed(2));
      } else {
        totals.total = Number((totals.total - coupon.discountValue).toFixed(2));
      }
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  let shippingAddress = body.shippingAddress;
  if (body.addressId) {
    const address = await Address.findById(body.addressId);
    if (!address) throw new AppError('Address not found', 404);
    shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      landmark: address.landmark
    };
  }

  const order = await Order.create({
    user: req.user._id,
    orderNumber: buildOrderNumber(),
    items,
    shippingAddress,
    deliveryFee,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    paymentMethod: body.paymentMethod,
    paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'pending',
    coupon: coupon?._id,
    notes: body.notes
  });

  await OrderItem.insertMany(
    items.map((item) => ({
      order: order._id,
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  );

  if (body.paymentMethod === 'razorpay') {
    const razorpayOrder = await createRazorpayOrder({
      amount: order.total,
      receipt: order.orderNumber
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: order.total,
      provider: 'razorpay',
      providerOrderId: razorpayOrder.id
    });

    await User.findByIdAndUpdate(req.user._id, { cartItems: [] });
      console.log('createOrder: created order', order._id.toString());
    return res.status(201).json({ order, razorpayOrder, payment, keyId: getRazorpayKeyId() });
  }

  await User.findByIdAndUpdate(req.user._id, { cartItems: [] });
    console.log('createOrder: created order', order._id.toString());
  res.status(201).json({ order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product').populate('coupon');
  if (!order) throw new AppError('Order not found', 404);
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Forbidden', 403);
  }
  res.json({ order });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ orderNumber: order.orderNumber, status: order.status, estimatedDeliveryMinutes: order.estimatedDeliveryMinutes });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const body = z.object({
    status: z.enum(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'])
  }).parse(req.body);

  const order = await Order.findByIdAndUpdate(req.params.id, { status: body.status }, { new: true });
  if (!order) throw new AppError('Order not found', 404);
  res.json({ order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw new AppError('Order not found', 404);
  res.json({ message: 'Order deleted' });
});

export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  const isOwner = order.user?.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new AppError('Forbidden', 403);

  // Allow cancelling only if not already cancelled/delivered
  if (order.status === 'cancelled' || order.status === 'delivered') {
    return res.json({ order });
  }

  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  );

  res.json({ order: updated });
});

export const generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) throw new AppError('Order not found', 404);

  const pdfBuffer = await buildInvoicePdf({
    ...order.toObject(),
    invoiceNumber: `INV-${order.orderNumber}`
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${order.orderNumber}.pdf"`);
  res.send(pdfBuffer);
});
