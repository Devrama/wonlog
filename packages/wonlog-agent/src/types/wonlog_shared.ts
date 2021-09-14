export interface AgentLog {
  streamID: string;
  logXRefID: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface HydratedLog {
  wonlogMetadata: {
    seqID: number;
    streamID: string;
    logXRefID: string;
    timestamp: number;
    propertyNames: string[];
  };
  message: string;
  [key: string]: unknown;
}

