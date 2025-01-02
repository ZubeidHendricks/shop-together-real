import React, { useState, useEffect } from 'react';
import { useShopify } from '../../contexts/ShopifyContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProductBrowser = ({ onProductSelect, sessionId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `/api/products?page=${page}&sessionId=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      
      setProducts(prev => [...prev, ...data.products]);
      setHasMore(data.currentPage < data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Card 
            key={product.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onProductSelect(product)}
          >
            <CardContent className="p-4">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h3 className="font-medium truncate">{product.title}</h3>
              <p className="text-sm text-gray-600">
                ${product.variants[0]?.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setPage(p => p + 1)}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default ProductBrowser;