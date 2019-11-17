/*
 * boot.ts discovers and processes artifacts based on conventions
 */
import { WonServerLocalApp } from './application';

new WonServerLocalApp().boot().start();
