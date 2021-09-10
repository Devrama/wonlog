import http from 'http';
import app from './src/app';
import { WonServer } from '../_won_modules/won-node-framework';

export class ExpressServer implements WonServer {
  private readonly ip: string;
  private readonly port: number;
  private _httpServer: http.Server | null = null;

  constructor(ip: string, port: number) {
    this.ip = ip;
    this.port = port;
    app.set('port', this.port);
  }

  public get httpServer(): http.Server | null {
    return this._httpServer;
  }

  public boot(): void {
    // TODO
  }

  public start(): void {
    this._httpServer = app.listen(app.get('port'), () => {
      console.log(
        '  App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
      );
      console.log('  Press CTRL-C to stop\n');
    });
  }

  public stop(): void {
    // TODO
  }
}
