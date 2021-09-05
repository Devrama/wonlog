import WebSocket from 'ws';
import http from 'http';
import { WonWebSocketServer } from '../../_won_modules/won-node-framework';

export class WonlogWebSocketServer extends WonWebSocketServer {
  constructor(httpServer: http.Server) {
    super(httpServer);
  }

  /**
   * @override
   */
  protected onBroadcast(clientSocket: WebSocket, data: Buffer): void {
    clientSocket.send(`broadcasting.. hello world from udp - ${data}`);
  }

  /**
   * @override
   */
  protected onMessage(clientSocket: WebSocket, data: WebSocket.Data): void {
    /*
    clientSocket.send(
      `Server received "${data}" from the client in the browser`
    );
    */

    const INTERVAL = 2000;

    setInterval(() => {
      clientSocket.send(
        JSON.stringify({
          timestamp: new Date(),
          message: `After ${INTERVAL} seconds, server sends "getting better!" to the client! The flex-grow property specifies how much the item will grow relative to the rest of the flexible items inside the same container. Note: If the element is not a flexible item, the flex-grow property has no effect. ${data}`,
        })
      );
    }, INTERVAL);
  }
}
