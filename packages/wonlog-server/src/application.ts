/*
 * application.ts is an entrypoint of all logic.
 */
import { Command } from 'commander';
import { ExpressServer } from './express_server';
import { WonlogUdpServer } from './udp_server';
import { WonlogWebSocketServer } from './websocket_server';
import { WonApplication } from './_won_modules/won-node-framework';

export class WonServerLocalApp implements WonApplication {
  #httpHost: string;
  #httpPort: number;
  #udpHost: string;
  #udpPort: number;

  constructor() {
    this.#httpHost = '0.0.0.0';
    this.#httpPort = 7979;
    this.#udpHost = '0.0.0.0';
    this.#udpPort = 7878;
  }

  public boot(): WonServerLocalApp {
    const program = new Command();
    program
      .option('-h, --http-host [host]', 'UDP Server host', '0.0.0.0')
      .option('-p, --http-port [port]', 'UDP Server port', '7979')
      .option('-h, --udp-host [host]', 'UDP Server host', '0.0.0.0')
      .option('-p, --udp-port [port]', 'UDP Server port', '7878');

    program.parse(process.argv);
    const options = program.opts();

    this.#httpHost = options.httpHost;
    this.#httpPort = Number(options.httpPort);
    this.#udpHost = options.udpHost;
    this.#udpPort = Number(options.udpPort);

    return this;
    // TODO
  }

  public start(): void {
    const expressServer = new ExpressServer(this.#httpHost, this.#httpPort);
    expressServer.start();

    if (!expressServer.httpServer) {
      throw new Error('Cannot find httpServer'); // TODO
    }
    const wonWebSocketServer = new WonlogWebSocketServer(
      expressServer.httpServer
    );
    wonWebSocketServer.start();
    new WonlogUdpServer(
      this.#udpHost,
      this.#udpPort,
      wonWebSocketServer
    ).start();
  }

  public stop(): void {
    // TODO
  }
}
