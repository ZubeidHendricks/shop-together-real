const Session = require('../models/Session');

const handleScreenSync = (io, socket) => {
  socket.on('sync_view', async ({ sessionId, state }) => {
    const session = await Session.findOne({ sessionId });
    
    if (session && session.host.toString() === socket.userId) {
      socket.to(sessionId).emit('view_update', state);
      
      // Update session state in database
      session.currentView = state;
      await session.save();
    }
  });

  socket.on('join_session', async ({ sessionId }) => {
    const session = await Session.findOne({ sessionId });
    
    if (session) {
      socket.join(sessionId);
      
      // Send current state to joining user
      socket.emit('view_update', session.currentView);
      
      // Notify user if they're the host
      const isHost = session.host.toString() === socket.userId;
      socket.emit('session_role', { isHost });
    }
  });
};

module.exports = handleScreenSync;