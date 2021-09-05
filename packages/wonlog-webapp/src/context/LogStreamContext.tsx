import React, { createContext, useState, useEffect, Dispatch } from 'react';
interface Log {
  timestamp: Date
  message: string
}

const LogStreamContext = createContext<Log[]>([])

// Create WebSocket connection.
let socket: WebSocket
let allLogs: Log[] = []

const useLogStreamWebSocket = (): Log[] => {
  const [ logs, setLogs ] = useState<Log[]>([]);

  const connectWebSocket = (): void => {
    if(socket && socket.readyState !== WebSocket.CLOSED) {
      return
    }

    socket = new WebSocket('ws://localhost:5000');
    // Connection opened
    socket.addEventListener('open', function(event) {
      console.log('open', event);
      socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function(event) {
      allLogs = [JSON.parse(event.data), ...allLogs]
      console.log('message', event);
      // Message from server
      setLogs([...allLogs]);
    });

    // Error
    socket.addEventListener('error', function(event) {
      console.log('error', event);
    });

    // Close
    socket.addEventListener('close', function(event) {
      console.log('closed', event);
      // Message from server
      setTimeout(() => {
        console.log('reconnecting..............');
        connectWebSocket()
      }, 3000)
    });
  }

  useEffect(() => {
    connectWebSocket()
  }, []); // Only on Mount

  return logs
}

const LogStreamProvider:React.FC = props => {
  const logs = useLogStreamWebSocket();
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
