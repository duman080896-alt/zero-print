import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  article: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
}

const CART_KEY = 'zeroprint_cart';

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach(fn => fn());
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    const sync = () => setItems(loadCart());
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setItems(next);
    notifyAll();
  }, []);

  const addItem = useCallback((product: any, qty = 1) => {
    const cart = loadCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.fullName || product.full_name || product.name,
        article: product.article || '',
        image: product.image || product.images?.[0] || '',
        price: product.price,
        qty,
        color: '',
      });
    }
    persist(cart);
  }, [persist]);

  const removeItem = useCallback((id: string) => {
    persist(loadCart().filter(i => i.id !== id));
  }, [persist]);

  const updateQty = useCallback((id: string, qty: number) => {
    const cart = loadCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      persist(cart);
    }
  }, [persist]);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const isInCart = useCallback((id: string) => items.some(i => i.id === id), [items]);

  return { items, addItem, removeItem, updateQty, clearCart, totalPrice, totalQty, isInCart };
}
