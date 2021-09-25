import { WonController } from '../../../../_won_modules/won-node-framework';
import { RequestHandlerMap } from '../../../../_won_modules/won-node-framework';
import { WonWebSocketServer } from '../../../../_won_modules/won-node-framework';
import { WonlogExpressApp } from '../../WonlogExpressApp';

export class WonlogController implements WonController {
  protected _wonlogExpressApp: WonlogExpressApp;

  constructor(wonlogExpressApp: WonlogExpressApp) {
    this._wonlogExpressApp = wonlogExpressApp;
  }

  public get _webSocketServer(): WonWebSocketServer {
    return this._wonlogExpressApp.getWebSocketServer();
  }

  public getExpressHandlers(): RequestHandlerMap {
    return {};
  }
}
