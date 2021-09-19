import http from 'http';
import app from './src/app';
import { WonServer } from '../_won_modules/won-node-framework';

export class ExpressServer implements WonServer {
  private readonly host: string;
  private readonly port: number;
  private _httpServer: http.Server | null = null;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    app.set('port', this.port);
    app.set('host', this.host);
  }

  public get httpServer(): http.Server | null {
    return this._httpServer;
  }

  public boot(): void {
    // TODO
  }

  public start(): void {
    this._httpServer = app.listen(app.get('port'), app.get('host'), () => {
      console.log(
        '  wonlog HTTP server is running at http://%s:%d',
        app.get('host'),
        app.get('port')
      );
    });
  }

  public stop(): void {
    // TODO
  }
}
