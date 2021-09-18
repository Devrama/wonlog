import React, { createContext, useState, useEffect } from 'react';
import { isEqual, union } from 'lodash';
import { format, fromUnixTime } from 'date-fns';
import { HydratedLog } from '../types/wonlog_shared';
import {
  useGlobalConfig,
  GlobalConfigActionType,
  GlobalConfigSetSearchModePayload,
  GlobalConfigSetLogSortingPayload,
} from './GlobalConfigContext';

type IncomingLog = HydratedLog;

export interface LogData {
  wonlogMetadata: IncomingLog['wonlogMetadata'] & {
    datetime: string;
    raw: string;
  };
  data: {
    message: string;
    [key: string]: unknown;
  };
}

export interface CurrentStream {
  streamID?: string;
  logs: LogData[];
}

const LogStreamContext = createContext<CurrentStream>({ logs: []});

// Create WebSocket connection.
let _socket: WebSocket;
const _streamLog = new Map<string, { isContextUpdated: boolean, logs: LogData[], propertyNames: string[] }>();
let _filteredStreamLog: Map<string, { isContextUpdated: boolean, logs: LogData[] }> | null = new Map<string, { isContextUpdated: boolean, logs: LogData[] }>();
let _intervalID: NodeJS.Timeout | null = null;
let _currentStreamID: string | undefined;
let _searchKeyword: string | undefined;
let _logBufferSize: number = Number(process.env.REACT_APP_LOG_BUFFER_SIZE) as number;
let _logSorting: GlobalConfigSetLogSortingPayload = GlobalConfigSetLogSortingPayload.DESC;
let _isSortingChanged = false;
let _searchMode: GlobalConfigSetSearchModePayload;

const hasText = (text: string, _searchKeyword: string): boolean => {
  if(_searchMode === GlobalConfigSetSearchModePayload.TEXT) {
    return new RegExp(_searchKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/, '\\$&'), 'i').test(text);
  } else {
    return new RegExp(_searchKeyword).test(text);
  }
};

const useLogStreamWebSocket = (): CurrentStream => {
  const [ currentLogs, setCurrentLogs ] = useState<CurrentStream>({ logs: [] });
  const { globalConfig, setGlobalConfig } = useGlobalConfig();
  _currentStreamID = globalConfig.currentStreamID;
  _searchKeyword = globalConfig.searchKeyword;
  _searchMode = globalConfig.searchMode;
  _logBufferSize = globalConfig.logBufferSize;
  _isSortingChanged = _logSorting !== globalConfig.logSorting;
  _logSorting = globalConfig.logSorting;

  const connectWebSocket = (): void => {
    let hasLogsToRender = false;

    if(_socket && _socket.readyState !== WebSocket.CLOSED) {
      return;
    }

    _socket = new WebSocket('ws://localhost:5000');
    // Connection opened
    _socket.addEventListener('open', function(event) {
      console.log('open', event);
      _socket.send('Hello Server!');
    });

    // Listen for messages
    _socket.addEventListener('message', function(event) {
      const incomingLogs: IncomingLog[] = JSON.parse(event.data);
      for(const { wonlogMetadata, data } of incomingLogs) {
        const streamID = wonlogMetadata.streamID;
        let logs: LogData[] = [];
        let filteredLogs: LogData[] = [];
        if(_streamLog.has(streamID)) {
          logs = _streamLog.get(streamID)?.logs ?? [];
        }
        if(_filteredStreamLog?.has(streamID)) {
          filteredLogs = _filteredStreamLog.get(streamID)?.logs ?? [];
        }

        const datetime: string = format(fromUnixTime(Math.floor(wonlogMetadata.timestamp/1000)), 'yyyy-MM-dd HH:mm:ss');
        const logData: LogData = {
          wonlogMetadata: {
            ...wonlogMetadata,
            datetime,
            raw: JSON.stringify(data),
          },
          data,
        };

        if(_logSorting === GlobalConfigSetLogSortingPayload.DESC) {
          logs.unshift(logData);
        } else {
          logs.push(logData);
        }

        if(logs.length > _logBufferSize) {
          logs.splice(_logBufferSize - logs.length);
        }

        if(_searchKeyword && hasText(logData.wonlogMetadata.raw, _searchKeyword) && _filteredStreamLog?.has(streamID)) {
          if(_logSorting === GlobalConfigSetLogSortingPayload.DESC) {
            filteredLogs.unshift(logData);
          } else {
            filteredLogs.push(logData);
          }

          if(filteredLogs.length > _logBufferSize) {
            filteredLogs.splice(_logBufferSize - filteredLogs.length);
          }
          _filteredStreamLog.set(streamID, { isContextUpdated: false, logs: filteredLogs });
        }

        if(!_streamLog.has(streamID)) {
          setGlobalConfig({
            type: GlobalConfigActionType.ADD_STREAM_ID,
            payload: streamID,
          });
        }

        const oldProperties = _streamLog.get(streamID)?.propertyNames ?? [];
        let mergedPropertyNames = oldProperties;

        if(!isEqual(oldProperties.sort(), logData.wonlogMetadata.propertyNames.sort())) {
          mergedPropertyNames = union(oldProperties, logData.wonlogMetadata.propertyNames);
          setGlobalConfig({
            type: GlobalConfigActionType.SET_STREAM_PROPERTY_NAMES,
            payload: {
              ...globalConfig.streamPropertyNames,
              [streamID]: [...mergedPropertyNames],
            }
          });
        }

        _streamLog.set(streamID, { isContextUpdated: false, logs, propertyNames: [...mergedPropertyNames] });
        hasLogsToRender = true;

        // Updating React.State in every events causes slowness if many logs are
        // inserted in short time.
        // setLogs({ streamID, logs });
      }
    });

    _intervalID = setInterval(() => {
      if(hasLogsToRender) {
        if(_filteredStreamLog === null && _searchKeyword) {
          _filteredStreamLog = new Map<string, { isContextUpdated: boolean, logs: LogData[] }>();
          _streamLog.forEach(({ logs }, streamID) => {
            const currentLogs = logs.filter(log => {
              return _searchKeyword ? hasText(log.wonlogMetadata.raw, _searchKeyword) : true;
            });
            _filteredStreamLog && _filteredStreamLog.set(streamID, { isContextUpdated: true, logs: currentLogs });
          });
        }

        _streamLog.forEach(({ logs, propertyNames }, streamID) => {
          if(_streamLog.get(streamID)?.isContextUpdated === false){
            if(streamID === _currentStreamID) {
              if(_filteredStreamLog) {
                setCurrentLogs({ streamID, logs: _filteredStreamLog.get(streamID)?.logs ?? [] });
              } else {
                setCurrentLogs({ streamID, logs });
              }
            } else if (!_currentStreamID){
              setGlobalConfig({
                type: GlobalConfigActionType.SET_CURRENT_STREAM_ID,
                payload: streamID,
              });
            }
            _streamLog.set(streamID, { isContextUpdated: true, logs, propertyNames });
          }
        });
        hasLogsToRender = false;
      }
    }, 300);

    // Error
    _socket.addEventListener('error', function(event) {
      if(_intervalID) {
        clearInterval(_intervalID);
      }
      console.log('error', event);
    });

    // Close
    _socket.addEventListener('close', function(event) {
      if(_intervalID) {
        clearInterval(_intervalID);
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
    _searchKeyword = globalConfig.searchKeyword;
    _filteredStreamLog = null;
  }, [globalConfig.searchKeyword, globalConfig.searchMode]);

  useEffect(() => {
    _filteredStreamLog = null;
  }, [_currentStreamID]);

  useEffect(() => {
    _streamLog.forEach(({ logs }) => {
      if(logs.length > _logBufferSize) {
        logs.splice(_logBufferSize - logs.length);
      }
    });
    if(_filteredStreamLog && _currentStreamID) {
      const filteredLogs = _filteredStreamLog.get(_currentStreamID)?.logs;
      if(filteredLogs && filteredLogs.length > _logBufferSize) {
        filteredLogs.splice(_logBufferSize - filteredLogs.length);
      }
    }
  }, [_logBufferSize]);

  useEffect(() => {
    if(!_searchKeyword && _currentStreamID) {
      setCurrentLogs({ streamID: _currentStreamID, logs: _streamLog.get(_currentStreamID)?.logs ?? [] });
    } if(_searchKeyword && _currentStreamID && _filteredStreamLog) {
      setCurrentLogs({ streamID: _currentStreamID, logs: _filteredStreamLog.get(_currentStreamID)?.logs ?? [] });
    } if(_searchKeyword && _currentStreamID && !_filteredStreamLog) {
      _filteredStreamLog = new Map<string, { isContextUpdated: boolean, logs: LogData[] }>();
      _streamLog.forEach(({ logs }, streamID) => {
        const currentLogs = logs.filter(log => {
          return _searchKeyword ? hasText(log.wonlogMetadata.raw, _searchKeyword) : true;
        });
        _filteredStreamLog && _filteredStreamLog.set(streamID, { isContextUpdated: true, logs: currentLogs });
      });
      setCurrentLogs({ streamID: _currentStreamID, logs: _filteredStreamLog.get(_currentStreamID)?.logs ?? [] });
    }
  }, [_currentStreamID, _searchKeyword]);

  useEffect(() => {
    if(_currentStreamID) {
      if(_isSortingChanged) {
        _streamLog.forEach(({ logs }) => {
          logs.reverse();
        });
        _filteredStreamLog && _filteredStreamLog.get(_currentStreamID)?.logs.reverse();
        _isSortingChanged = false;
      }

      if(_searchKeyword && _filteredStreamLog) {
        setCurrentLogs({ streamID: _currentStreamID, logs: _filteredStreamLog.get(_currentStreamID)?.logs ?? [] });
      } else {
        setCurrentLogs({ streamID: _currentStreamID, logs: _streamLog.get(_currentStreamID)?.logs ?? [] });
      }
    }
  }, [_isSortingChanged, _logBufferSize]);

  useEffect(() => {
    connectWebSocket();

    return (): void => {
      if(_intervalID) {
        clearInterval(_intervalID);
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
