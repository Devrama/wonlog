import React, { createContext, useState, useEffect, Dispatch } from 'react';

interface OriginalLogData {
  wonlogMetadata: {
    logID: number
    datetime: string
    propertyNames: string[]
  }
  [key: string]: unknown
}

export interface LogData {
  _logID: number
  _datetime: string
  [key: string]: unknown
}

const LogStreamContext = createContext<LogData[]>([])

// Create WebSocket connection.
let socket: WebSocket
let allLogs: LogData[] = []

const useLogStreamWebSocket = (): LogData[] => {
  const [ logs, setLogs ] = useState<LogData[]>([]);

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
      const { wonlogMetadata: { logID, datetime }, ...rest }: OriginalLogData = JSON.parse(event.data)
      allLogs.unshift({
        _logID: logID,
        _datetime: datetime,
        ...rest,
      })

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
