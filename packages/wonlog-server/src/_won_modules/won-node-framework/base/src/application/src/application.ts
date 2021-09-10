export interface WonApplication {
  boot(): WonApplication; // Discover artifacts automatically based on a convention, and process them.
  start(): void;
  stop(): void;
}
