import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Mic, MicOff } from 'lucide-react';

const VoiceChat = ({ socket, sessionId }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [peers, setPeers] = useState({});
  const streamRef = useRef();
  const peersRef = useRef({});

  useEffect(() => {
    // Initialize voice chat
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        streamRef.current = stream;
        socket.emit('voice_join', { sessionId });
      })
      .catch(err => console.error('Error accessing microphone:', err));

    // Handle new peer joining
    socket.on('user_joined_voice', ({ userId }) => {
      const peer = createPeer(userId, socket.id, streamRef.current);
      peersRef.current[userId] = peer;
    });

    // Handle incoming signal
    socket.on('voice_signal', ({ from, signal }) => {
      if (!peersRef.current[from]) {
        const peer = addPeer(signal, from, streamRef.current);
        peersRef.current[from] = peer;
      } else {
        peersRef.current[from].signal(signal);
      }
    });

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      Object.values(peersRef.current).forEach(peer => peer.destroy());
    };
  }, []);

  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socket.emit('voice_signal', { userToSignal, callerId, signal });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socket.emit('voice_signal', { userToSignal: callerId, signal });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const toggleMute = () => {
    streamRef.current.getAudioTracks().forEach(track => {
      track.enabled = isMuted;
    });
    setIsMuted(!isMuted);
    socket.emit('voice_mute', { sessionId, isMuted: !isMuted });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
      <button
        onClick={toggleMute}
        className={`p-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
    </div>
  );
};

export default VoiceChat;