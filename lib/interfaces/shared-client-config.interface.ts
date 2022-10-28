import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { ClientOptions } from '@temporalio/client';

export interface SharedClientConfigurationFactory {
  createSharedConfiguration(): Promise<ClientOptions> | ClientOptions;
}

export interface SharedClientAsyncConfiguration
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Existing Provider to be used.
   */
  useExisting?: Type<SharedClientConfigurationFactory>;
  /**
   * Type (class name) of provider (instance to be registered and injected).
   */
  useClass?: Type<SharedClientConfigurationFactory>;
  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory?: (...args: any[]) => Promise<ClientOptions> | ClientOptions;
  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject?: FactoryProvider['inject'];
}
