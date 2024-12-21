import React, { createContext, useContext, useState } from 'react';

const ShopifyContext = createContext(null);

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
};

export const ShopifyProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchShopDetails = async () => {
    try {
      const response = await fetch('/api/shopify/shop', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setShop(data);
    } catch (error) {
      console.error('Error fetching shop details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    shop,
    isLoading,
    fetchShopDetails
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
};