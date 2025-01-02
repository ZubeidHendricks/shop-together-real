import React from 'react';
import { useSharedCart } from '../../contexts/CartContext';

const SharedCart = () => {
  const { items, updateQuantity, removeItem, checkout } = useSharedCart();

  const total = items.reduce((sum, item) => (
    sum + (item.price * item.quantity)
  ), 0);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Shared Cart</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-500">Added by {item.addedBy}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={checkout}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedCart;