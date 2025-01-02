import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProductRecommendations = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [sessionId, user]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `/api/recommendations?sessionId=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.map(product => (
          <div
            key={product.id}
            className="bg-gray-50 rounded p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => onProductSelect(product)}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h3 className="font-medium text-sm">{product.title}</h3>
            <p className="text-gray-600 text-sm">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;