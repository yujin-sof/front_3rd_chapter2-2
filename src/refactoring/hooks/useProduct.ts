import { useState } from 'react';
import { Product } from '../../types.ts';


export const useProducts = (initialProducts: Product[]) => {

  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updateProduct: Product) => {
    setProducts(prevProducts => prevProducts.map(product => product.id === updateProduct.id ? updateProduct : product)
    );
  }

  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  return { 
    products, 
    updateProduct, 
    addProduct,
  };
};
