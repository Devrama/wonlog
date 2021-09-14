import React, { createContext, useState, useEffect } from 'react';
import { format, fromUnixTime } from 'date-fns';
import { HydratedLog } from '../types/wonlog_shared';
import { useGlobalConfig, GlobalConfigActionType } from './GlobalConfigContext';

type IncomingLog = HydratedLog;

export interface LogData {
  _seqID: number
  _streamID: string
  _logXRefID: string
  _timestamp: number
  _datetime: string
  message: string
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
let filteredStreamLog: Map<string, { isContextUpdated: boolean, logs: LogData[] }> | null = new Map<string, { isContextUpdated: boolean, logs: LogData[] }>();
let intervalID: NodeJS.Timeout | null = null;
let currentStreamID: string | undefined;
let searchKeyword: string | undefined;

const useLogStreamWebSocket = (): CurrentStream => {
  const [ currentLogs, setCurrentLogs ] = useState<CurrentStream>({ logs: [] });
  const { globalConfig, setGlobalConfig } = useGlobalConfig();
  currentStreamID = globalConfig.currentStreamID;
  searchKeyword = globalConfig.searchKeyword;

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
      const { wonlogMetadata: { seqID, streamID, logXRefID, timestamp, propertyNames }, message, ...rest }: IncomingLog = JSON.parse(event.data);

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
      let filteredLogs: LogData[] = [];
      if(streamLog.has(streamID)) {
        logs = streamLog.get(streamID)?.logs ?? [];
      }
      if(filteredStreamLog?.has(streamID)) {
        filteredLogs = filteredStreamLog.get(streamID)?.logs ?? [];
      }

      const logData: LogData = {
          _seqID: seqID,
        _streamID: streamID,
        _logXRefID: logXRefID,
        _timestamp: timestamp,
        _datetime: format(fromUnixTime(Math.floor(timestamp/1000)), 'yyyy-MM-dd HH:mm:ss'),
        message,
        ...rest,
      };

      logs.unshift(logData);

      if(searchKeyword && message.includes(searchKeyword) && filteredStreamLog?.has(streamID)) {
        filteredLogs.unshift(logData);
        filteredStreamLog.set(streamID, { isContextUpdated: false, logs: filteredLogs });
      }

      streamLog.set(streamID, { isContextUpdated: false, logs });
      hasLogsToRender = true;

      // Updating React.State in every events causes slowness if many logs are
      // inserted in short time.
      // setLogs({ streamID, logs });
    });

    intervalID = setInterval(() => {
      if(hasLogsToRender) {
        if(filteredStreamLog === null && searchKeyword) {
          filteredStreamLog = new Map<string, { isContextUpdated: boolean, logs: LogData[] }>();
          streamLog.forEach(({ logs }, streamID) => {
            const currentLogs = logs.filter(log => {
              return searchKeyword ? log.message.includes(searchKeyword) : true;
            });
            filteredStreamLog && filteredStreamLog.set(streamID, { isContextUpdated: true, logs: currentLogs });
          });
        }

        streamLog.forEach(({ logs }, streamID) => {
          if(streamLog.get(streamID)?.isContextUpdated === false){
            if(streamID === currentStreamID) {
              if(filteredStreamLog) {
                setCurrentLogs({ streamID, logs: filteredStreamLog.get(streamID)?.logs ?? [] });
              } else {
                setCurrentLogs({ streamID, logs });
              }
            } else if (!currentStreamID){
              setGlobalConfig({
                type: GlobalConfigActionType.SET_CURRENT_STREAM_ID,
                payload: streamID,
              });
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
    searchKeyword = globalConfig.searchKeyword;
    filteredStreamLog = null;
  }, [globalConfig.searchKeyword]);

  /*
  useEffect(() => {
    if(globalConfig.currentStreamID) {
      const { logs = [] } = streamLog.get(globalConfig.currentStreamID) ?? {};
      setCurrentLogs({ streamID: globalConfig.currentStreamID, logs });
    }
  }, [globalConfig.currentStreamID]);
   */

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
