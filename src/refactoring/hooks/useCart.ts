// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from './utils/cartUtils';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 장바구니에 상품추가
  const addToCart = (product: Product) => {

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        // 이미 장바구니에 있는 경우 수량 증가
        return updateCartItemQuantity(cart, product.id, existingItem.quantity + 1);
      } else {
        // 장바구니에 없는 경우 새로 추가
        return [...prevCart, { product, quantity: 1 }];
      }
    });

  };

  // 장바구니에 상품 삭제
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // 장바구니 수량 변경
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          const maxQuantity = item.product.stock;
          const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
          return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null)
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => {
    const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateCartTotal(cart, selectedCoupon);

    return {
      totalBeforeDiscount, 
      totalAfterDiscount, 
      totalDiscount
    }
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
