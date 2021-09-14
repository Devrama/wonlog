import http from 'http';
import { WonWebSocketServer } from '../../_won_modules/won-node-framework';
import { AgentLog, HydratedLog } from '../../types/wonlog_shared';

type IncomingLog = AgentLog;
type OutgoingLog = HydratedLog;

const streamSeqID = new Map<string, number>();

export class WonlogWebSocketServer extends WonWebSocketServer {
  constructor(httpServer: http.Server) {
    super(httpServer);
  }

  /**
   * @override
   */
  protected onBroadcast(buffer: Buffer): string {
    const { streamID, logXRefID, timestamp, data }: IncomingLog = JSON.parse(
      buffer.toString()
    );
    if (streamSeqID.has(streamID)) {
      streamSeqID.set(streamID, Number(streamSeqID.get(streamID)) + 1);
    } else {
      streamSeqID.set(streamID, 1);
    }
    return JSON.stringify({
      ...data,
      wonlogMetadata: {
        seqID: streamSeqID.get(streamID),
        streamID,
        logXRefID,
        timestamp,
        propertyNames: Object.keys(data),
      },
    } as OutgoingLog);
  }
}
