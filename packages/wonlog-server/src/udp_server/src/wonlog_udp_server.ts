import {
  WonUdpSocketServer,
  WonWebSocketServer,
} from '../../_won_modules/won-node-framework';

export class WonlogUdpServer extends WonUdpSocketServer {
  private readonly _webSocketServer: WonWebSocketServer;

  constructor(host: string, port: number, webSocketServer: WonWebSocketServer) {
    super(host, port);
    this._webSocketServer = webSocketServer;
  }

  /**
   * @override
   */
  protected onMessage(data: Buffer): void {
    this._webSocketServer.broadcast(data);
  }
}
