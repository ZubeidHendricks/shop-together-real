import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const VoiceChat = () => {
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL);
    setSocket(newSocket);

    // Listen for voice streams
    newSocket.on('voice-stream', (data) => {
      const audioBlob = new Blob([data], { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });

    return () => newSocket.close();
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      socket.emit('voice-data', audioBlob);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="voice-chat">
      {!isRecording ? (
        <button onClick={startRecording}>Start Voice Chat</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>
  );
};

export default VoiceChat;