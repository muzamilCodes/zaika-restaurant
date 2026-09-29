export function calculateOrderTotals(items, deliveryFee = 0, taxRate = 0.05) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));

  return { subtotal, tax, deliveryFee, total };
}
