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
    clientSocket.send(
      `A message to client.. hello world from server - ${data}`
    );
    setTimeout(() => {
      clientSocket.send('getting better!');
    }, 3000);
  }
}
