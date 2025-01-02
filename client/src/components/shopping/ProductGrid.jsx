import React, { useEffect, useState } from 'react';
import { shopifyService } from '../../services/shopify';

const ProductGrid = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await shopifyService.getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow p-4 cursor-pointer"
          onClick={() => onProductSelect(product)}
        >
          <img
            src={product.images[0]?.src}
            alt={product.title}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="mt-2 text-lg font-semibold">{product.title}</h3>
          <p className="text-gray-600">${product.variants[0]?.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;