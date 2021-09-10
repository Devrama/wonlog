import WebSocket from 'ws';
import http from 'http';
import { WonServer } from '../../base';

export abstract class WonWebSocketServer implements WonServer {
  private readonly httpServer: http.Server;
  private _webSocketServer: WebSocket.Server | null = null;

  constructor(httpServer: http.Server) {
    this.httpServer = httpServer;
  }

  public boot(): void {
    // TODO
  }

  public start(): void {
    this._webSocketServer = new WebSocket.Server({ server: this.httpServer });
    this.attachEvents();
  }

  public stop(): void {
    // TODO
  }

  private get webSocketServer(): WebSocket.Server {
    if (!this._webSocketServer) {
      throw new Error('web socket server did not start yet'); // TODO
    }
    return this._webSocketServer;
  }

  private attachEvents(): void {
    this.webSocketServer.on('connection', (socket: WebSocket) => {
      socket.on('message', (data: WebSocket.Data) => {
        this.onMessage(socket, data);
      });

      this.onConnection(socket);
    });
  }

  public broadcast(data: Buffer): void {
    const dataToSend: string | void = this.onBroadcast(data);
    this.webSocketServer.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN && dataToSend) {
        client.send(dataToSend);
      }
    });
  }

  protected abstract onBroadcast(data: Buffer): void | string;
  protected onConnection(socket: WebSocket): void {} // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  protected onMessage(socket: WebSocket, data: WebSocket.Data): void {} // eslint-disable-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
}
