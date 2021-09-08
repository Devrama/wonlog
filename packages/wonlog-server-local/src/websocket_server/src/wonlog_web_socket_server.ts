import WebSocket from 'ws';
import { format } from 'date-fns';
import http from 'http';
import { WonWebSocketServer } from '../../_won_modules/won-node-framework';

interface LogData {
  wonlogMetadata: {
    logID: number;
    datetime: string;
    propertyNames: string[];
  };
  [key: string]: unknown;
}

let _logID = 0;

export class WonlogWebSocketServer extends WonWebSocketServer {
  constructor(httpServer: http.Server) {
    super(httpServer);
  }

  /**
   * @override
   */
  protected onBroadcast(clientSocket: WebSocket, data: Buffer): void {
    // clientSocket.send(`broadcasting.. hello world from udp - ${data}`);
    const logData: { content: LogData } = JSON.parse(data.toString());
    clientSocket.send(
      JSON.stringify({
        ...logData.content,
        wonlogMetadata: {
          logID: ++_logID,
          datetime: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
          propertyNames: Object.keys(logData.content),
        },
      })
    );
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
