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
  protected onBroadcast(socket: WebSocket, data: Buffer): void {
    socket.send(`broadcasting.. hello world from udp - ${data}`);
  }
}
