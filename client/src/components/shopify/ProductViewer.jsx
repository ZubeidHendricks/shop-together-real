import React from 'react';
import { useShopify } from '../../contexts/ShopifyContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProductViewer = ({ product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      variantId: selectedVariant.id,
      quantity,
      productDetails: {
        title: product.title,
        price: selectedVariant.price
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative pb-[100%]">
              <img
                src={product.images[0]}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} view ${index + 2}`}
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <p className="text-xl font-medium mt-2">
                ${selectedVariant.price}
              </p>
            </div>

            {product.variants.length > 1 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Variants
                </label>
                <select
                  value={selectedVariant.id}
                  onChange={(e) => setSelectedVariant(
                    product.variants.find(v => v.id === e.target.value)
                  )}
                  className="w-full p-2 border rounded"
                >
                  {product.variants.map(variant => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>

            <div className="prose mt-6">
              <h3 className="text-lg font-medium">Description</h3>
              <div dangerouslySetInnerHTML={{ 
                __html: product.description 
              }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductViewer;