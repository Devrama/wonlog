import express, { Express } from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import errorHandler from 'errorhandler';
import { WonWebSocketServer } from '../../_won_modules/won-node-framework';
import { WonlogRouter } from './WonlogRouter';

export class WonlogExpressApp {
  private _app: Express;
  protected _webSocketServer: WonWebSocketServer | null = null;

  constructor() {
    // Create Express server
    this._app = express();
    this.initialize();
  }

  public getApp(): Express {
    return this._app;
  }

  public getWebSocketServer(): WonWebSocketServer {
    if (!this._webSocketServer) {
      throw new Error('websocket is not ready');
    }
    return this._webSocketServer;
  }

  public setWebSocketServer(webSocketServer: WonWebSocketServer): void {
    this._webSocketServer = webSocketServer;
  }

  private initialize(): void {
    // Express configuration
    // app.set('port', process.env.PORT || 5000);
    this._app.use(compression());
    this._app.use(bodyParser.json());
    this._app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    this._app.use(lusca.xframe('SAMEORIGIN'));
    this._app.use(lusca.xssProtection(true));

    this.initializeRoutes();

    /**
     * Error Handler. Provides full stack - remove for production
     */
    this._app.use(errorHandler());
  }

  private initializeRoutes(): void {
    this._app.use(new WonlogRouter(this).getExpressRouter());
  }
}
