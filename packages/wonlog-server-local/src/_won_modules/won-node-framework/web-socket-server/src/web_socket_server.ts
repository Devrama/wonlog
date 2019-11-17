import WebSocket from 'ws';
import http from 'http';
import { WonServer } from '../../base';

export abstract class WonWebSocketServer implements WonServer {
  private readonly httpServer: http.Server;
  private _webSocketServer: WebSocket.Server | null = null;

  constructor(httpServer: http.Server) {
    this.httpServer = httpServer;
  }

  public boot() {
    // TODO
  }

  public start() {
    this._webSocketServer = new WebSocket.Server({ server: this.httpServer });
    this.attachEvents();
  }

  public stop() {
    // TODO
  }

  private get webSocketServer() {
    if (!this._webSocketServer) {
      throw new Error('web socket server did not start yet'); // TODO
    }
    return this._webSocketServer;
  }

  private attachEvents() {
    this.webSocketServer.on('connection', (socket: WebSocket) => {
      socket.on('message', (data: WebSocket.Data) => {
        this.onMessage(data);
      });

      this.onConnection(socket);
    });
  }

  public broadcast(data: Buffer): void {
    this.webSocketServer.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        this.onBroadcast(client, data);
      }
    });
  }

  protected abstract onBroadcast(socket: WebSocket, data: Buffer): void;
  protected onConnection(socket: WebSocket): void {} // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  protected onMessage(data: WebSocket.Data): void {} // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
}
