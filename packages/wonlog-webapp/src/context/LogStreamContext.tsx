import React, { createContext, useState, useEffect } from 'react';
import { HydratedLog } from '../types/wonlog_shared';
import { useGlobalConfig, GlobalConfigActionType } from './GlobalConfigContext';

type IncomingLog = HydratedLog;

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

const LogStreamContext = createContext<CurrentStream>({ logs: []});

// Create WebSocket connection.
let socket: WebSocket;
const streamLog = new Map<string, { isContextUpdated: boolean, logs: LogData[] }>();
let intervalID: NodeJS.Timeout | null = null;
let currentStreamID: string | undefined;

const useLogStreamWebSocket = (): CurrentStream => {
  const [ currentLogs, setCurrentLogs ] = useState<CurrentStream>({ logs: [] });
  const { globalConfig, setGlobalConfig } = useGlobalConfig();
  currentStreamID = globalConfig.currentStreamID;

  const connectWebSocket = (): void => {
    let hasLogsToRender = false;

    if(socket && socket.readyState !== WebSocket.CLOSED) {
      return;
    }

    socket = new WebSocket('ws://localhost:5000');
    // Connection opened
    socket.addEventListener('open', function(event) {
      console.log('open', event);
      socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function(event) {
      const { wonlogMetadata: { seqID, streamID, logXRefID, timestamp, propertyNames }, ...rest }: IncomingLog = JSON.parse(event.data);

      setGlobalConfig({
        type: GlobalConfigActionType.ADD_STREAM_ID,
        payload: streamID,
      });
      setGlobalConfig({
        type: GlobalConfigActionType.SET_STREAM_PROPERTY_NAMES,
        payload: {
          ...globalConfig.streamPropertyNames,
          [streamID]: propertyNames,
        }
      });

      let logs: LogData[] = [];
      if(streamLog.has(streamID)) {
        logs = streamLog.get(streamID)?.logs ?? [];
      }

      logs.unshift({
          _seqID: seqID,
        _streamID: streamID,
        _logXRefID: logXRefID,
        _timestamp: timestamp,
        ...rest,
      });

      streamLog.set(streamID, { isContextUpdated: false, logs });
      hasLogsToRender = true;

      // Updating React.State in every events causes slowness if many logs are
      // inserted in short time.
      // setLogs({ streamID, logs });
    });

    intervalID = setInterval(() => {
      if(hasLogsToRender) {
        streamLog.forEach(({ logs }, streamID) => {
          if(streamLog.get(streamID)?.isContextUpdated === false){
            if(streamID === currentStreamID) {
              setCurrentLogs({ streamID, logs });
            }
            streamLog.set(streamID, { isContextUpdated: true, logs });
          }
        });
        hasLogsToRender = false;
      }
    }, 100);

    // Error
    socket.addEventListener('error', function(event) {
      if(intervalID) {
        clearInterval(intervalID);
      }
      console.log('error', event);
    });

    // Close
    socket.addEventListener('close', function(event) {
      if(intervalID) {
        clearInterval(intervalID);
      }
      console.log('closed', event);
      // Message from server
      setTimeout(() => {
        console.log('reconnecting..............');
        connectWebSocket();
      }, 3000);
    });
  };

  useEffect(() => {
    if(globalConfig.currentStreamID) {
      const { logs = [] } = streamLog.get(globalConfig.currentStreamID) ?? {};
      setCurrentLogs({ streamID: globalConfig.currentStreamID, logs });
    }
  }, [globalConfig.currentStreamID]);

  useEffect(() => {
    connectWebSocket();

    return (): void => {
      if(intervalID) {
        clearInterval(intervalID);
      }
    };
  }, []); // Only on Mount

  return currentLogs;
};

const LogStreamProvider:React.FC = props => {
  const currentLogs = useLogStreamWebSocket();
  return (
    <LogStreamContext.Provider value={currentLogs}>
      {props.children}
    </LogStreamContext.Provider>
  );
};

const LogStreamConsumer = LogStreamContext.Consumer;

export {
  LogStreamContext,
  LogStreamProvider,
  LogStreamConsumer,
};
