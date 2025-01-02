import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const useCollaborativeShopping = (productId) => {
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Connect to collaboration namespace
    const collaborationSocket = io(`${process.env.REACT_APP_SERVER_URL}/collaboration`);
    setSocket(collaborationSocket);

    // Join collaborative session
    collaborationSocket.emit('join-session', {
      productId,
      userId: user.id,
      userName: user.email
    });

    // Listen for session updates
    collaborationSocket.on('session-updated', (sessionData) => {
      setParticipants(sessionData.participants);
      setIsHost(sessionData.host === user.id);
    });

    // Cleanup on unmount
    return () => {
      collaborationSocket.disconnect();
    };
  }, [productId, user]);

  // Synchronize cursor movement
  const syncCursorPosition = useCallback((position) => {
    if (socket) {
      socket.emit('cursor-move', {
        productId,
        userId: user.id,
        position
      });
    }
  }, [socket, productId, user]);

  // Synchronize product interactions
  const syncProductInteraction = useCallback((interaction) => {
    if (socket) {
      socket.emit('product-interaction', {
        productId,
        userId: user.id,
        interaction
      });
    }
  }, [socket, productId, user]);

  return {
    participants,
    isHost,
    syncCursorPosition,
    syncProductInteraction
  };
};

export default useCollaborativeShopping;