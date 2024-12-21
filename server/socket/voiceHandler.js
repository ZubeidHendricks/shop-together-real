const handleVoiceChat = (io, socket) => {
  socket.on('voice_join', ({ sessionId }) => {
    socket.join(`voice_${sessionId}`);
    socket.to(`voice_${sessionId}`).emit('user_joined_voice', {
      userId: socket.id
    });
  });

  socket.on('voice_signal', ({ userToSignal, signal }) => {
    io.to(userToSignal).emit('voice_signal', {
      signal,
      from: socket.id
    });
  });

  socket.on('voice_mute', ({ sessionId, isMuted }) => {
    socket.to(`voice_${sessionId}`).emit('user_muted', {
      userId: socket.id,
      isMuted
    });
  });
};

module.exports = handleVoiceChat;