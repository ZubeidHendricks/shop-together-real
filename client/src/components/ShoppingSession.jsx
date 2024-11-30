import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const ShoppingSession = () => {
  const { sessionId } = useParams();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Shopping Session: {sessionId}</h1>
    </div>
  );
};

export default ShoppingSession;