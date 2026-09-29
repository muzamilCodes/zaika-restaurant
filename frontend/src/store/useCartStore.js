import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const deliveryFee = 49;

function normalizeProductId(product) {
  return String(product?._id || product?.id || product?.slug || product?.name || '');
}

function normalizeItems(items = []) {
  return items
    .filter((item) => item && item.name)
    .map((item) => ({
      ...item,
      id: normalizeProductId(item),
      image: item.image || item.images?.[0] || '',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1)
    }))
    .filter((item) => item.id);
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const id = normalizeProductId(product);
          const existing = state.items.find((item) => item.id === id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + quantity } : item
              )
            };
          }

          return {
            items: [
              ...state.items,
              {
                id,
                name: product.name,
                price: product.discountedPrice || product.price,
                image: product.images?.[0] || product.image,
                quantity
              }
            ]
          };
        }),
      updateItem: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === String(id) ? { ...item, quantity } : item))
        })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== String(id)) })),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      tax: () => Number((get().subtotal() * 0.05).toFixed(2)),
      total: () => Number((get().subtotal() + get().tax() + deliveryFee).toFixed(2)),
      deliveryFee: () => deliveryFee
    }),
    {
      name: 'zaika-cart',
      version: 2,
      migrate: (persistedState) => ({
        ...persistedState,
        items: normalizeItems(persistedState?.items)
      })
    }
  )
);
