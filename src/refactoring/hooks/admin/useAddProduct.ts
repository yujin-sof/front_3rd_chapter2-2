import { useState } from "react";
import { Product } from '../../../types.ts';

export const useAddProduct = (onProductAdd: (newProduct: Product) => void) => {
    const [showNewProductForm, setShowNewProductForm] = useState(false); // 새로운 상품 추가 폼을 표시할지 여부.
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        price: 0,
        stock: 0,
        discounts: []
    });

    // 새로운 상품을 추가하는 함수.
    function handleAddNewProduct () {
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

    return {
        showNewProductForm,
        setShowNewProductForm,
        newProduct,
        setNewProduct,
        handleAddNewProduct
    }

} 