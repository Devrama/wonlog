import { WonModule } from '../../base';

type Service = object;

interface Modules {
  [moduleName: string]: WonModule;
}

interface Services {
  global: {
    [serviceName: string]: Service;
  };
  module: {
    [serviceName: string]: Service;
  };
  request: {
    [serviceName: string]: Service;
  };
}

export class WonKernel {
  static instance: WonKernel | null = null;
  private _modules: Modules = {};
  private _services: Services = { global: {}, module: {}, request: {} };

  constructor() {
    if (WonKernel.instance) {
      throw new Error('WonKernel can be instantiated only once'); // TODO
    }

    WonKernel.instance = this;

    return this;
  }

  public loadModule(module: WonModule): void {
    const moduleName = typeof module;

    if (this._modules[moduleName]) {
      throw new Error(`The module, ${moduleName}, is already loaded`); // TODO
    }

    this._modules[moduleName] = module;
    module.start();
  }
}
