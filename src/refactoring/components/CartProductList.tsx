import { CartItem, Product } from '../../types.ts';

interface Props {
    products: Product[];
    cart: CartItem[];
    addToCart: (product: Product) => void;
  }

export const CartProductList = ({products, cart, addToCart}: Props) => {

  // 상품에 적용 가능한 할인 중 최대 할인율을 계산하는 함수입니다. 각 상품에는 여러 개의 할인 조건이 있을 수 있는데, 그중 가장 높은 할인율을 반환합니다.
  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  // 장바구니에 담긴 상품의 수량을 고려하여 남은 재고를 계산합니다. 장바구니에 담긴 수량이 있으면 해당 수량을 재고에서 뺍니다.
  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

    return (
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">

            {products.map(product => {
              const remainingStock = getRemainingStock(product);

              return (
                <div key={product.id} data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-gray-600">{product.price.toLocaleString()}원</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    <span className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      재고: {remainingStock}개
                    </span>
                    {product.discounts.length > 0 && (
                      <span className="ml-2 font-medium text-blue-600">
                        최대 {(getMaxDiscount(product.discounts) * 100).toFixed(0)}% 할인
                      </span>
                    )}
                  </div>
                  {product.discounts.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
                      {product.discounts.map((discount, index) => (
                        <li key={index}>
                          {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full px-3 py-1 rounded ${
                      remainingStock > 0
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={remainingStock <= 0}
                  >
                    {remainingStock > 0 ? '장바구니에 추가' : '품절'}
                  </button>
                </div>
              );

            })}

          </div>
        </div>
    )
}