import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
// 조금 찝찝하니까 다시 확인해보기, 이 함수가 사용되는 곳이 없음.

  const clone = [structuredClone(item)];

  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  clone.forEach(item => {
    const { price } = item.product;
    const { quantity } = item;
    totalBeforeDiscount += price * quantity;

    const discount = item.product.discounts.reduce((maxDiscount, d) => {
      return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
    }, 0);

    totalAfterDiscount += price * quantity * (1 - discount);
  });

  return totalAfterDiscount;
   
};


export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product; // 제품의 할인 정보를 추출
  
  // 할인 정보가 없거나 모든 할인율이 0인 경우 0을 반환
  if (discounts.length === 0 || discounts.every(discount => discount.rate === 0)) {
    return 0;
  }

  // 적용 가능한 할인율 계산
  const applicableDiscounts = discounts.filter(discount => item.quantity >= discount.quantity);
  if (applicableDiscounts.length === 0) {
    return 0; // 적용 가능한 할인율이 없으면 0 반환
  }

  // 최대 할인율 계산
  const maxDiscount = applicableDiscounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  
  return maxDiscount; // 최대 할인율 반환
};


export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;
  let totalDiscount = 0;

  // 장바구니 아이템별로 총액 계산
  cart.forEach(item => {
    const { price } = item.product;
    const { quantity } = item;

    // 총액 계산 (할인 전)
    totalBeforeDiscount += price * quantity;

    // 최대 할인율 적용된 총액 계산 (할인 후)
    const applicableDiscount = getMaxApplicableDiscount(item);
    const discountAmount = price * quantity * applicableDiscount;
    totalAfterDiscount += price * quantity - discountAmount;
  });

  // 총 할인액 계산
  totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else if (selectedCoupon.discountType === 'percentage') {
      totalAfterDiscount *= (1 - selectedCoupon.discountValue / 100);
    }

    // 쿠폰 적용 후 총 할인액 재계산
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
    // 상품의 재고를 가져오는 함수 (실제 구현에서 재고를 가져오는 방법에 따라 조정 필요)
    const getProductById = (id: string) => {
      // 이 부분은 실제로 데이터베이스나 다른 소스에서 상품 정보를 가져오는 로직으로 대체해야 합니다.
      return cart.find(item => item.product.id === id)?.product;
    };
  
    const updatedCart = cart.map(item => {
      // 상품 ID가 일치하는 경우 수량을 업데이트
      if (item.product.id === productId) {
        if (newQuantity <= 0) {
          // 수량이 0인 경우 항목을 제거할 것이므로 반환하지 않음
          return null;
        }
        
        const stock = getProductById(productId)?.stock || 0; // 상품의 재고 수량
        const updatedQuantity = Math.min(newQuantity, stock); // 재고 한도를 초과하지 않도록 조정
        return { ...item, quantity: updatedQuantity }; // 수량 업데이트
      }
      
      return item; // 상품 ID가 일치하지 않으면 그대로 반환
    }).filter(item => item !== null); // null 값 필터링하여 제거
  
    return updatedCart;
};
