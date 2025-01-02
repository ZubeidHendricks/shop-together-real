import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();

    // Socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL);
    setSocket(newSocket);

    // Collaborative browsing
    newSocket.on('browse-synced', (data) => {
      console.log('Synchronized browsing:', data);
    });

    return () => newSocket.close();
  }, []);

  const handleProductSelect = (product) => {
    // Emit product selection to other users
    socket.emit('sync-browse', { productId: product._id });
  };

  return (
    <div className="product-list">
      {products.map(product => (
        <div 
          key={product._id} 
          onClick={() => handleProductSelect(product)}
          className="product-item"
        >
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;