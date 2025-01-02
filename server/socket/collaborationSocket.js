const initializeCollaborationSocket = (io) => {
  // Collaborative shopping namespace
  const collaborationNamespace = io.of('/collaboration');

  // Active collaborative sessions
  const activeSessions = new Map();

  collaborationNamespace.on('connection', (socket) => {
    console.log('New client connected to collaboration namespace');

    // Join or create collaborative shopping session
    socket.on('join-session', (sessionData) => {
      const { productId, userId, userName } = sessionData;
      
      // Create or join existing session
      if (!activeSessions.has(productId)) {
        activeSessions.set(productId, {
          host: userId,
          participants: new Map(),
          product: null
        });
      }

      const session = activeSessions.get(productId);
      session.participants.set(socket.id, {
        userId,
        userName
      });

      // Broadcast session update
      collaborationNamespace.to(productId).emit('session-updated', {
        participants: Array.from(session.participants.values()),
        host: session.host
      });

      // Join room for this product
      socket.join(productId);
    });

    // Synchronize cursor position
    socket.on('cursor-move', (cursorData) => {
      socket.broadcast.to(cursorData.productId).emit('remote-cursor-move', cursorData);
    });

    // Product interaction synchronization
    socket.on('product-interaction', (interactionData) => {
      socket.broadcast.to(interactionData.productId).emit('remote-product-interaction', interactionData);
    });

    // Voice chat signaling
    socket.on('voice-signal', (signalData) => {
      socket.broadcast.to(signalData.productId).emit('voice-signal-received', signalData);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      // Remove participant from sessions
      for (const [productId, session] of activeSessions.entries()) {
        if (session.participants.has(socket.id)) {
          session.participants.delete(socket.id);

          // Broadcast updated session
          collaborationNamespace.to(productId).emit('session-updated', {
            participants: Array.from(session.participants.values()),
            host: session.host
          });

          // Remove session if no participants
          if (session.participants.size === 0) {
            activeSessions.delete(productId);
          }
        }
      }
    });
  });

  return collaborationNamespace;
};

module.exports = initializeCollaborationSocket;