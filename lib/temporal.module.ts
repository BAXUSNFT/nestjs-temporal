import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { NativeConnectionOptions, WorkerOptions, RuntimeOptions } from '@temporalio/worker';

import { TemporalMetadataAccessor } from './temporal-metadata.accessors';
import { TemporalExplorer } from './temporal.explorer';
import {
  SharedWorkerAsyncConfiguration,
  TemporalModuleOptions,
  SharedRuntimeAsyncConfiguration,
  SharedConnectionAsyncConfiguration,
  SharedClientAsyncConfiguration,
} from './interfaces';
import {
  TEMPORAL_CORE_CONFIG,
  TEMPORAL_WORKER_CONFIG,
  TEMPORAL_CONNECTION_CONFIG,
  TEMPORAL_CLIENT_CONFIG
} from './temporal.constants';
import { createClientProviders } from './temporal.providers';

@Module({})
export class TemporalModule {
  static forRoot(
    workerConfig: WorkerOptions,
    connectionConfig?: NativeConnectionOptions,
    runtimeConfig?: RuntimeOptions,
  ): DynamicModule {
    const workerConfigProvider: Provider = {
      provide: TEMPORAL_WORKER_CONFIG,
      useValue: workerConfig,
    };

    const connectionConfigProvider: Provider = {
      provide: TEMPORAL_CORE_CONFIG,
      useValue: connectionConfig,
    };

    const runtimeConfigProvider: Provider = {
      provide: TEMPORAL_CORE_CONFIG,
      useValue: runtimeConfig,
    };

    return {
      global: true,
      module: TemporalModule,
      providers: [workerConfigProvider, connectionConfigProvider, runtimeConfigProvider],
      imports: [TemporalModule.registerCore()],
    };
  }

  static forRootAsync(
    asyncWorkerConfig: SharedWorkerAsyncConfiguration,
    asyncConnectionConfig?: SharedConnectionAsyncConfiguration,
    asyncRuntimeConfig?: SharedRuntimeAsyncConfiguration,
    asyncClientConfig?: SharedClientAsyncConfiguration,
  ): DynamicModule {
    const providers: Provider[] = [
      this.createAsyncProvider(TEMPORAL_WORKER_CONFIG, asyncWorkerConfig),
      this.createAsyncProvider(TEMPORAL_CONNECTION_CONFIG, asyncConnectionConfig),
      this.createAsyncProvider(TEMPORAL_CORE_CONFIG, asyncRuntimeConfig),
      this.createAsyncProvider(TEMPORAL_CLIENT_CONFIG, asyncClientConfig)
    ];

    return {
      global: true,
      module: TemporalModule,
      providers: [...providers],
      imports: [TemporalModule.registerCore()],
      exports: providers,
    };
  }

  private static createAsyncProvider(
    provide: string,
    options?: SharedWorkerAsyncConfiguration | SharedRuntimeAsyncConfiguration | SharedConnectionAsyncConfiguration | SharedClientAsyncConfiguration,
  ): Provider {
    if (options?.useFactory) {
      return {
        provide,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide,
      useValue: null,
    } as Provider;
  }

  static registerClient(options?: TemporalModuleOptions): DynamicModule {
    const createClientProvider = createClientProviders([].concat(options));
    return {
      global: true,
      module: TemporalModule,
      providers: createClientProvider,
      exports: createClientProvider,
    };
  }
  static registerClientAsync(options: TemporalModuleOptions): DynamicModule {
    throw new Error('Method not implemented.');
  }

  private static registerCore() {
    return {
      global: true,
      module: TemporalModule,
      imports: [DiscoveryModule],
      providers: [TemporalExplorer, TemporalMetadataAccessor],
    };
  }
}
