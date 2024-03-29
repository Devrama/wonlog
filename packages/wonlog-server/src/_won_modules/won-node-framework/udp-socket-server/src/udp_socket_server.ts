import dgram, { RemoteInfo } from 'dgram';
import { WonServer } from '../../base';

export abstract class WonUdpSocketServer implements WonServer {
  private readonly host: string;
  private readonly port: number;
  private _udpServer: dgram.Socket | null = null;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public boot(): void {
    // TODO
  }

  public start(): void {
    this._udpServer = dgram.createSocket('udp4');
    this._attachEvents();
    this.udpServer.bind(this.port, this.host, (): void => {
      console.log(
        '  wonlog UDP server is running at http://%s:%d',
        this.host,
        this.port
      );
    });
  }

  public stop(): void {
    // TODO
  }

  private _attachEvents(): void {
    this.udpServer.on('message', (data: Buffer, remote: RemoteInfo) => {
      this.onMessage(data, remote);
    });
  }

  private get udpServer(): dgram.Socket {
    if (!this._udpServer) {
      throw new Error('UDP server did not start yet');
    }
    return this._udpServer;
  }

  protected abstract onMessage(data: Buffer, remote: RemoteInfo): void;
}
