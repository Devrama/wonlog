interface baseMetadata {
  streamID: string;
  logXRefID: string;
  timestamp: number;
}

export interface AgentLog {
  wonlogMetadata: baseMetadata;
  data: Record<string, unknown>;
}

export interface HydratedLog {
  wonlogMetadata: baseMetadata & {
    seqID: number;
    propertyNames: string[];
  };
  data: {
    message: string;
    level?: string;
    [key: string]: unknown;
  };
}
