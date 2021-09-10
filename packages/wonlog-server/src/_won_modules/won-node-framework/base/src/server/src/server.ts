export interface WonServer {
  boot(): void; // Discover artifacts automatically based on a convention, and process them.
  start(): void;
  stop(): void;
}
