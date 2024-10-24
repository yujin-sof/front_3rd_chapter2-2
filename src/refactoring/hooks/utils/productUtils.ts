import { Product } from '../../../types.ts';

// 상품 정보를 업데이트하는 순수 함수
export const updateProductField = (product: Product, newValue: string | number, field: 'name' | 'price'): Product => {
        return { ...product, [field]: newValue };
  };
  
// 주어진 업데이트 함수에 따라 상품을 업데이트하는 순수 함수
export const applyProductUpdate = (product: Product, updateFn: (product: Product) => Product): Product => {
    return updateFn(product);
};