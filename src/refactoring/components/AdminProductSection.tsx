import { useState } from 'react';
import { Discount, Product } from '../../types.ts';

interface Props {
    products: Product[];
    onProductUpdate: (updatedProduct: Product) => void;
    onProductAdd: (newProduct: Product) => void;
  }

export const AdminProductSection = ( {products, onProductUpdate, onProductAdd}: Props ) => {

    const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());  // 열려있는 상품의 ID들을 Set으로 관리합니다.
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);  // 현재 수정 중인 상품.
    const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });  // 새로운 할인 정보.
    const [showNewProductForm, setShowNewProductForm] = useState(false); // 새로운 상품 추가 폼을 표시할지 여부.
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        price: 0,
        stock: 0,
        discounts: []
    });


    // 특정 상품의 상세 정보를 열거나 닫는 함수.
    function toggleProductAccordion (productId: string) {
      setOpenProductIds(prev => {
        const newSet = new Set(prev);
        newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
      });
    };

    // 선택한 상품을 수정할 준비를 하는 함수.
    const handleEditProduct = (product: Product) => {
        setEditingProduct({...product});
    };

    

    // 계산 : 수정상품 이름 업데이트
    const productNameUpdate = (productId: string, newName: string) => {
      if (editingProduct && editingProduct.id === productId) {
        const updatedProduct = { ...editingProduct, name: newName };
        setEditingProduct(updatedProduct);
        }
    }
    // 수정 중인 상품의 이름으ㄹ 업데이트하는 함수.
    const handleProductNameUpdate = (productId: string, newName: string) => {
      productNameUpdate(productId, newName);
    };


    // 계산 : 수정상품 가격 업데이트
    const priceUpdate = (productId: string, newPrice: number) => {
      if (editingProduct && editingProduct.id === productId) {
        const updatedProduct = { ...editingProduct, price: newPrice };
        setEditingProduct(updatedProduct);
        }
    }
    // 수정 중인 상품의 가격을 업데이트하는 함수.
    const handlePriceUpdate = (productId: string, newPrice: number) => {
      priceUpdate(productId, newPrice);
    };



    // 새로운 핸들러 함수 추가  // 수정 중인 상품의 재고를 각각 업데이트하는 함수.
    const handleStockUpdate = (productId: string, newStock: number) => {
        const updatedProduct = products.find(p => p.id === productId);
        if (updatedProduct) {
        const newProduct = { ...updatedProduct, stock: newStock };
        onProductUpdate(newProduct);
        setEditingProduct(newProduct);
        }
    };

    // 수정 완료 핸들러 함수 추가  // 상품 수정을 완료하고 업데이트하는 함수.
    const handleEditComplete = () => {
        if (editingProduct) {
        onProductUpdate(editingProduct);
        setEditingProduct(null);
        }
    };

    //  상품에 할인 정보를 추가하는 함수.
    const handleAddDiscount = (productId: string) => {
        const updatedProduct = products.find(p => p.id === productId);
        if (updatedProduct && editingProduct) {
        const newProduct = {
            ...updatedProduct,
            discounts: [...updatedProduct.discounts, newDiscount]
        };
        onProductUpdate(newProduct);
        setEditingProduct(newProduct);
        setNewDiscount({ quantity: 0, rate: 0 });
        }
    };

    //  특정 상품에서 할인 정보를 제거하는 함수.
    const handleRemoveDiscount = (productId: string, index: number) => {
        const updatedProduct = products.find(p => p.id === productId);
        if (updatedProduct) {
        const newProduct = {
            ...updatedProduct,
            discounts: updatedProduct.discounts.filter((_, i) => i !== index)
        };
        onProductUpdate(newProduct);
        setEditingProduct(newProduct);
        }
    };

    // 새로운 상품을 추가하는 함수.
    const handleAddNewProduct = () => {
        const productWithId = { ...newProduct, id: Date.now().toString() };
        onProductAdd(productWithId);
        setNewProduct({
        name: '',
        price: 0,
        stock: 0,
        discounts: []
        });
        setShowNewProductForm(false);
    };


    return (
        <div>
        <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
        <button
          onClick={() => setShowNewProductForm(!showNewProductForm)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
        >
          {showNewProductForm ? '취소' : '새 상품 추가'}
        </button>
        {showNewProductForm && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
            <div className="mb-2">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">상품명</label>
              <input
                id="productName"
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">가격</label>
              <input
                id="productPrice"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">재고</label>
              <input
                id="productStock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleAddNewProduct}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>
        )}
        <div className="space-y-2">
          {products.map((product, index) => (
            <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
              <button
                data-testid="toggle-button"
                onClick={() => toggleProductAccordion(product.id)}
                className="w-full text-left font-semibold"
              >
                {product.name} - {product.price}원 (재고: {product.stock})
              </button>
              {openProductIds.has(product.id) && (
                <div className="mt-2">
                  {editingProduct && editingProduct.id === product.id ? (
                    <div>
                      <div className="mb-4">
                        <label className="block mb-1">상품명: </label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">가격: </label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => handlePriceUpdate(product.id, parseInt(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">재고: </label>
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      {/* 할인 정보 수정 부분 */}
                      <div>
                        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                        {editingProduct.discounts.map((discount, index) => (
                          <div key={index} className="flex justify-between items-center mb-2">
                            <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                            <button
                              onClick={() => handleRemoveDiscount(product.id, index)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="수량"
                            value={newDiscount.quantity}
                            onChange={(e) => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
                            className="w-1/3 p-2 border rounded"
                          />
                          <input
                            type="number"
                            placeholder="할인율 (%)"
                            value={newDiscount.rate * 100}
                            onChange={(e) => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
                            className="w-1/3 p-2 border rounded"
                          />
                          <button
                            onClick={() => handleAddDiscount(product.id)}
                            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                          >
                            할인 추가
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleEditComplete}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                      >
                        수정 완료
                      </button>
                    </div>
                  ) : (
                    <div>
                      {product.discounts.map((discount, index) => (
                        <div key={index} className="mb-2">
                          <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                        </div>
                      ))}
                      <button
                        data-testid="modify-button"
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                      >
                        수정
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    )
}