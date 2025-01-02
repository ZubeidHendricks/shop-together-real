import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useCollaborativeShopping from '../../hooks/useCollaborativeShopping';
import axiosInstance from '../../utils/axiosConfig';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { 
    participants, 
    isHost, 
    syncCursorPosition, 
    syncProductInteraction 
  } = useCollaborativeShopping(productId);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProduct(response.data);
        
        // Select default variant
        if (response.data.variants?.length) {
          setSelectedVariant(response.data.variants[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product details', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    syncProductInteraction({
      type: 'variant-selected',
      variantId: variant._id
    });
  };

  // Add to cart
  const addToCart = async () => {
    try {
      await axiosInstance.post('/cart/add', {
        productId,
        variantId: selectedVariant._id,
        quantity: 1
      });

      syncProductInteraction({
        type: 'added-to-cart',
        variantId: selectedVariant._id
      });
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  if (!product) return <div>Loading product details...</div>;

  return (
    <div className="product-detail-container">
      <div className="product-header">
        <h1>{product.name}</h1>
        {isHost && <span className="host-badge">Session Host</span>}
      </div>

      <div className="participants-list">
        <h3>Collaborators</h3>
        {participants.map(participant => (
          <div key={participant.userId} className="participant-item">
            {participant.userName}
          </div>
        ))}
      </div>

      <div className="product-content">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-info">
          <p className="description">{product.description}</p>
          <p className="price">${product.price}</p>

          <div className="variants">
            <h4>Select Variant</h4>
            {product.variants.map(variant => (
              <button
                key={variant._id}
                className={`variant-btn ${selectedVariant?._id === variant._id ? 'selected' : ''}`}
                onClick={() => handleVariantSelect(variant)}
              >
                {variant.size} - {variant.color}
              </button>
            ))}
          </div>

          <button 
            className="add-to-cart-btn"
            onClick={addToCart}
            disabled={!selectedVariant}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;