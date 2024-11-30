import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShoppingSession from './components/ShoppingSession';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/shop/:sessionId" element={<ShoppingSession />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;