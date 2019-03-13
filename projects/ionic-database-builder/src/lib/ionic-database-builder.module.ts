import { DatabaseCreatorContract } from 'database-builder';
import { Type, ModuleWithProviders, NgModule, SkipSelf, Optional } from '@angular/core';
import { DatabaseMigrationContract } from './services/database-migration-contract';
import { DatabaseSettingsFactoryContract } from './utils/database-settings-factory-contract';
import { IS_AVAILABLE_DATABASE, DATABASE_CREATOR, IS_ENABLE_LOG, DATABASE_MIGRATION } from './utils/dependency-injection-definition';
import { Database } from './services/database';
import { DatabaseMigration } from './services/database-migration';
import { DatabaseHelperService } from './services/database-helper.service';
import { DatabaseFactoryDefault } from './defaults/database-factory-default';
import { DatabaseFactoryContract } from './utils/database-factory-contract';

@NgModule({
  providers: [
    DatabaseMigration,
    Database,
    DatabaseHelperService,
    {
      provide: DatabaseFactoryContract,
      useClass: DatabaseFactoryDefault
    }
  ]
})
export class IonicDatabaseBuilderModule {

  constructor(@Optional() @SkipSelf() parentModule: IonicDatabaseBuilderModule) {
    if (parentModule) {
      throw new Error(
        'IonicDatabaseBuilderModule is already loaded. Import it in the AppModule only');
    }
  }

  public static forSimple(
    isEnableLogProvider: boolean = false,
    isAvailableProvider: boolean = true
  ): ModuleWithProviders {
    return {
      ngModule: IonicDatabaseBuilderModule,
      providers: [
        { provide: IS_ENABLE_LOG, useValue: isEnableLogProvider },
        { provide: IS_AVAILABLE_DATABASE, useValue: isAvailableProvider },
      ]
    };
  }

  public static forRoot(
    settingsProvider: Type<DatabaseSettingsFactoryContract>,
    databaseCreatorProvider: Type<DatabaseCreatorContract>,
    databaseMigrationContract: Type<DatabaseMigrationContract>,
    isEnableLogProvider: boolean = false,
    isAvailableProvider: boolean = true,
  ): ModuleWithProviders {
    return {
      ngModule: IonicDatabaseBuilderModule,
      providers: [
        { provide: DatabaseSettingsFactoryContract, useClass: settingsProvider },
        { provide: DATABASE_CREATOR, useClass: databaseCreatorProvider },
        { provide: DATABASE_MIGRATION, useClass: databaseMigrationContract },
        { provide: IS_ENABLE_LOG, useValue: isEnableLogProvider },
        { provide: IS_AVAILABLE_DATABASE, useValue: isAvailableProvider },
      ]
    };
  }
}
