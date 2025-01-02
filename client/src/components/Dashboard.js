import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <nav>
        <button onClick={() => navigate('/products')}>Browse Products</button>
        <button onClick={() => navigate('/voice-chat')}>Voice Chat</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
};

export default Dashboard;