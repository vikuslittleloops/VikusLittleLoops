import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "vll_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product_id === product.product_id);
      if (found) {
        return prev.map((i) =>
          i.product_id === product.product_id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setOpen(true);
  };

  const remove = (product_id) => setItems((prev) => prev.filter((i) => i.product_id !== product_id));

  const setQty = (product_id, quantity) =>
    setItems((prev) =>
      prev
        .map((i) => (i.product_id === product_id ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );

  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const i of items) {
      count += i.quantity;
      subtotal += i.price * i.quantity;
    }
    return { count, subtotal };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, count, subtotal, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
