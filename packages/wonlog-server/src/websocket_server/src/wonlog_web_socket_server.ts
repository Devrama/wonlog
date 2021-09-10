import http from 'http';
import { WonWebSocketServer } from '../../_won_modules/won-node-framework';

interface IncomingLog {
  streamID: string;
  logXRefID: string;
  timestamp: number;
  data: Record<string, unknown>;
}

interface OutgoingLog {
  wonlogMetadata: {
    seqID: number;
    streamID: string;
    logXRefID: string;
    timestamp: number;
    propertyNames: string[];
  };
  [key: string]: unknown;
}

const streamSeqID = new Map<string, number>();

export class WonlogWebSocketServer extends WonWebSocketServer {
  constructor(httpServer: http.Server) {
    super(httpServer);
  }

  /**
   * @override
   */
  protected onBroadcast(buffer: Buffer): string {
    const { streamID, logXRefID, timestamp, data }: IncomingLog = JSON.parse(
      buffer.toString()
    );
    if (streamSeqID.has(streamID)) {
      streamSeqID.set(streamID, Number(streamSeqID.get(streamID)) + 1);
    } else {
      streamSeqID.set(streamID, 1);
    }
    return JSON.stringify({
      ...data,
      wonlogMetadata: {
        seqID: streamSeqID.get(streamID),
        streamID,
        logXRefID,
        timestamp,
        propertyNames: Object.keys(data),
      },
    } as OutgoingLog);
  }

  /**
   * @override
   */
  /*
  protected onMessage(clientSocket: WebSocket, data: WebSocket.Data): void {
    clientSocket.send(
      `Server received "${data}" from the client in the browser`
    );

    const INTERVAL = 2000;

    setInterval(() => {
      _logID++
      const log = {
        message: `After ${INTERVAL} seconds, server sends "getting better!" to the client! The flex-grow property specifies how much the item will grow relative to the rest of the flexible items inside the same container. Note: If the element is not a flexible item, the flex-grow property has no effect. ${data}`,
      }

      const logData: LogData = {
        wonlogMetadata: {
          logID: _logID,
          datetime: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
          propertyNames: Object.keys(log),
        },
        ...log,
      }
      clientSocket.send(
        JSON.stringify(logData)
      );
    }, INTERVAL);
  }
  */
}
