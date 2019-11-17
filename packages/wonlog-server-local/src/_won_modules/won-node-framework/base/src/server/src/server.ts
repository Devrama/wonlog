export interface WonServer {
  boot(): any; // Discover artifacts automatically based on a convention, and process them.
  start(): any;
  stop(): any;
}
