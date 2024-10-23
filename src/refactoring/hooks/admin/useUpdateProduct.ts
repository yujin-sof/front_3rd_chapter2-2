import { useState } from "react";
import { Discount, Product } from '../../../types.ts';

interface Props {
    products: Product[];
    onProductUpdate: (updatedProduct: Product) => void;
  }

export const useEditProduct = ({products, onProductUpdate}: Props) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);  // 현재 수정 중인 상품.
    const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });  // 새로운 할인 정보.

    const productEditUpdate = (productId: string, newValue: string | number, field: 'name' | 'price') => {
        if (editingProduct && editingProduct.id === productId) {
          const updatedProduct = { ...editingProduct, [field]: newValue };
          setEditingProduct(updatedProduct);
          return updatedProduct;
        }
        return undefined;
      };

    const updateProduct = (productId: string, updateFn: (product: Product) => Product) => {
        const product = products.find((p) => p.id === productId);
        if (product) {
            const updatedProduct = updateFn(product);
            onProductUpdate(updatedProduct);
            setEditingProduct(updatedProduct);
            return updatedProduct;
        }
        return undefined;
    };
  

    // 상품 수정을 완료하고 업데이트하는 함수.
    function handleEditComplete () {
        if (editingProduct) {
        onProductUpdate(editingProduct);
        setEditingProduct(null);
        }
    };

    // 선택한 상품을 수정할 준비를 하는 함수.
    function handleEditProduct (product: Product) {
        setEditingProduct({...product});
      };

    // 수정 중인 상품의 이름 업데이트하는 함수.
    function handleNameUpdate (productId: string, newName: string) {
    productEditUpdate(productId, newName, 'name');
    };

    // 수정 중인 상품의 가격 업데이트하는 함수.
    function handlePriceUpdate (productId: string, newPrice: number) {
    productEditUpdate(productId, newPrice, 'price');
    };


    // 수정 중인 상품의 재고를 각각 업데이트하는 함수.
    function handleStockUpdate (productId: string, newStock: number) {
    updateProduct(productId, (product) => ({
        ...product,
        stock: newStock,
    }));
    };

    //  상품에 할인 정보를 추가하는 함수.
    function handleAddDiscount (productId: string) {
    updateProduct(productId, (product) => ({
        ...product,
        discounts: [...product.discounts, newDiscount],
    }));
    setNewDiscount({ quantity: 0, rate: 0 });
    };

    //  특정 상품에서 할인 정보를 제거하는 함수.
    function handleRemoveDiscount (productId: string, index: number) {
    updateProduct(productId, (product) => ({
        ...product,
        discounts: product.discounts.filter((_, i) => i !== index),
    }));
    };


    return {
        editingProduct,
        newDiscount,
        setNewDiscount,
        handleEditComplete,
        handleEditProduct,
        handleNameUpdate,
        handlePriceUpdate,
        handleStockUpdate,
        handleAddDiscount,
        handleRemoveDiscount
    }

} 