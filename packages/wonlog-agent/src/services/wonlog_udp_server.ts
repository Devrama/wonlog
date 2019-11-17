import {
  WonUdpSocketServer,
  WonWebSocketServer,
} from '../../_won_modules/won-node-framework';

export class WonlogUdpServer extends WonUdpSocketServer {
  private readonly _webSocketServer: WonWebSocketServer;

  constructor(
    ip: string = '0.0.0.0',
    port: number = 7081,
    webSocketServer: WonWebSocketServer
  ) {
    super(ip, port);
    this._webSocketServer = webSocketServer;
  }

  /**
   * @override
   */
  protected onMessage(data: Buffer): void {
    this._webSocketServer.broadcast(data);
  }
}
