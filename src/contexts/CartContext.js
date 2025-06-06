"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

const CartContext = createContext();

export function CartProvider({ children, user }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const isFirstLoad = useRef(true);

  // Load cart dari localStorage untuk semua user (sementara)
  useEffect(() => {
    const loadCart = async () => {
      setIsLoadingCart(true);
      
      try {
        const savedCart = localStorage.getItem("alcary-cart");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
      
      setIsLoadingCart(false);
      isFirstLoad.current = false;
    };

    loadCart();
  }, [user?.id]);

  // Simpan cart ke localStorage saja (sementara disable database)
  const saveCart = useCallback(async (items) => {
    if (isLoadingCart || isFirstLoad.current) return;

    try {
      localStorage.setItem("alcary-cart", JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }

    // DISABLE DATABASE SAVE SEMENTARA - AKAN DIAKTIFKAN SETELAH TABEL DIPERBAIKI
    /*
    if (user?.id) {
      try {
        // Database logic akan diaktifkan nanti
      } catch (error) {
        console.error('Database cart save disabled temporarily');
      }
    }
    */
  }, [user?.id, isLoadingCart]);

  // Auto-save cart ketika cartItems berubah
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems, saveCart]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.selling_price * item.quantity), 0);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = item.selling_price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  const checkout = (user) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (cartItems.length === 0) return;

    let message = "🛒 *Pesanan Baru dari Website*\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Kategori: ${item.category}\n`;
      message += `   Harga: Rp ${item.selling_price.toLocaleString('id-ID')}\n`;
      message += `   Jumlah: ${item.quantity} pcs\n`;
      message += `   Subtotal: Rp ${(item.selling_price * item.quantity).toLocaleString('id-ID')}\n\n`;
    });
    message += `💰 *Total: Rp ${getTotalPrice().toLocaleString('id-ID')}*\n\n`;
    message += "✨ Semua produk akan dibuat fresh setelah konfirmasi pesanan\n\n";
    message += "Mohon konfirmasi pesanan ini, terima kasih! 🙏";

    const waNumber = "6282152673902";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    clearCart();
    setIsCartOpen(false);
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    cartSubtotal,
    checkout,
    setCartItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}