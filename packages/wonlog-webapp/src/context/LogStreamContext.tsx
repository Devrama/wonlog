import React, { createContext, useState, useEffect, Dispatch } from 'react';

interface IncomingLog {
  wonlogMetadata: {
    seqID: number
    streamID: string
    logXRefID: string
    timestamp: number
    propertyNames: string[];
  };
  [key: string]: unknown;
}

export interface LogData {
  _seqID: number
  _streamID: string
  _logXRefID: string
  _timestamp: number
  [key: string]: unknown
}

interface CurrentStream {
  streamID?: string
  logs: LogData[]
}

const LogStreamContext = createContext<CurrentStream>({ logs: []})

// Create WebSocket connection.
let socket: WebSocket
const streamLog = new Map<string, LogData[]>()

const useLogStreamWebSocket = (): CurrentStream => {
  const [ logs, setLogs ] = useState<CurrentStream>({ logs: [] });

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
      const { wonlogMetadata: { seqID, streamID, logXRefID, timestamp }, ...rest }: IncomingLog = JSON.parse(event.data)

      let logs: LogData[] = []
      if(streamLog.has(streamID)) {
        logs = streamLog.get(streamID)!
      }

      logs.unshift({
          _seqID: seqID,
        _streamID: streamID,
        _logXRefID: logXRefID,
        _timestamp: timestamp,
        ...rest,
      })

      streamLog.set(streamID, logs)

      setLogs({ streamID, logs });
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
