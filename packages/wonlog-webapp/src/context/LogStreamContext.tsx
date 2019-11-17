import React, { createContext, useState, useEffect } from 'react';
const LogStreamContext = createContext('')

// Create WebSocket connection.
const socket = new WebSocket('ws://192.168.5.3:8080');

const useLogStreamWebSocket = (): string => {
  const [ logs, setLogs ] = useState('init');

  useEffect(() => {
    // Connection opened
    socket.addEventListener('open', function(event) {
      console.log('open');
      socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function(event) {
      console.log('message');
      // Message from server
      setLogs(event.data);
    });
  }, []); // Only on Mount

  return logs
}

const LogStreamProvider:React.FC = props => {
  const logs = useLogStreamWebSocket();
  console.log('===========', logs);
  return (
    <LogStreamContext.Provider value={logs}>
      {props.children}
    </LogStreamContext.Provider>
  );
};

const LogStreamConsumer = LogStreamContext.Consumer;

export {
  LogStreamContext,
  LogStreamProvider,
  LogStreamConsumer,
}
