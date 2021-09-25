import http from 'http';
import { WonlogExpressApp } from './src/WonlogExpressApp';
import { WonWebSocketServer } from '../_won_modules/won-node-framework';
import { WonServer } from '../_won_modules/won-node-framework';

export class ExpressServer implements WonServer {
  private _webSocketServer: WonWebSocketServer | null = null;
  private _wonlogExpressApp: WonlogExpressApp | null = null;
  private readonly host: string;
  private readonly port: number;
  private _httpServer: http.Server | null = null;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public get httpServer(): http.Server | null {
    return this._httpServer;
  }

  public boot(): void {
    // TODO
  }

  public start(): void {
    this.initialize();
  }

  public stop(): void {
    // TODO
  }

  private initialize(): void {
    this._wonlogExpressApp = new WonlogExpressApp();

    const app = this._wonlogExpressApp.getApp();
    app.set('port', this.port);
    app.set('host', this.host);

    this._httpServer = app.listen(app.get('port'), app.get('host'), () => {
      console.log(
        '  wonlog HTTP server is running at http://%s:%d',
        app.get('host'),
        app.get('port')
      );
    });
  }

  public setWebSocketServer(webSocketServer: WonWebSocketServer): void {
    this._webSocketServer = webSocketServer;
    if (this._wonlogExpressApp) {
      this._wonlogExpressApp.setWebSocketServer(webSocketServer);
    } else {
      throw new Error('WonlogExpressApp is not ready');
    }
  }
}
