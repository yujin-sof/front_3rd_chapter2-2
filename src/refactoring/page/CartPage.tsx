import { Coupon, Product } from '../../types.ts';
import { useCart } from "../hooks/index.ts";
import { CartProductList } from '../components/CartProductList.tsx';
import { CartDashBoard } from '../components/CartDashBoard.tsx'

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <CartProductList
        products={products}
        cart={cart}
        addToCart={addToCart}
      >
      </CartProductList>
        
      <CartDashBoard
        coupons={coupons}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        applyCoupon={applyCoupon}
        calculateTotal={calculateTotal}
        selectedCoupon={selectedCoupon}
      >
      </CartDashBoard>
        
      </div>
    </div>
  );
};
