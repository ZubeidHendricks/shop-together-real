import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ScreenSync = ({ socket, children }) => {
  const { sessionId } = useParams();
  const [viewState, setViewState] = useState(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    socket.emit('join_session', { sessionId });

    socket.on('session_role', ({ isHost: hostStatus }) => {
      setIsHost(hostStatus);
    });

    socket.on('view_update', (newState) => {
      if (!isHost) {
        setViewState(newState);
      }
    });

    return () => {
      socket.emit('leave_session', { sessionId });
    };
  }, [sessionId, socket]);

  const updateView = (newState) => {
    if (isHost) {
      setViewState(newState);
      socket.emit('sync_view', { sessionId, state: newState });
    }
  };

  return (
    <div className="relative">
      {children({
        viewState,
        updateView,
        isHost
      })}
    </div>
  );
};

export default ScreenSync;