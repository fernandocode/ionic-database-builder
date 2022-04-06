import { DatabaseCreatorContract } from 'database-builder';
import { Type, NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { DatabaseMigrationContract } from './services/database-migration-contract';
import { DatabaseSettingsFactoryContract } from './utils/database-settings-factory-contract';
import {
  IS_AVAILABLE_DATABASE, DATABASE_CREATOR, IS_ENABLE_LOG, DATABASE_MIGRATION, PLATFORM_LOAD
} from './utils/dependency-injection-definition';
import { Database } from './services/database';
import { DatabaseMigration } from './services/database-migration';
import { DatabaseHelperService } from './services/database-helper.service';
import { DatabaseFactoryDefault } from './defaults/database-factory-default';
import { DatabaseFactoryContract } from './utils/database-factory-contract';
import { PlatformLoad } from './utils/platform-load';
import { PlatformLoadDefault } from './utils/platform-load-default';

@NgModule({
  providers: [
    DatabaseMigration,
    Database,
    DatabaseHelperService,
    {
      provide: DatabaseFactoryContract,
      useClass: DatabaseFactoryDefault
    },
    {
      provide: PLATFORM_LOAD,
      useClass: PlatformLoadDefault
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

  /** @deprecated use forRoot */
public static forSimple(isEnableLogProvider: boolean = false, isAvailableProvider: boolean = true, platformLoad: Type<PlatformLoad> = PlatformLoadDefault): ModuleWithProviders<IonicDatabaseBuilderModule> {
    return {
        ngModule: IonicDatabaseBuilderModule,
        providers: [
            { provide: IS_ENABLE_LOG, useValue: isEnableLogProvider },
            { provide: IS_AVAILABLE_DATABASE, useValue: isAvailableProvider },
            { provide: PLATFORM_LOAD, useClass: platformLoad },
        ]
    };
}

  public static forRoot(settingsProvider: Type<DatabaseSettingsFactoryContract>, databaseCreatorProvider: Type<DatabaseCreatorContract>, databaseMigrationContract: Type<DatabaseMigrationContract>, platformLoad: Type<PlatformLoad> = PlatformLoadDefault, isEnableLogProvider: boolean = false, isAvailableProvider: boolean = true): ModuleWithProviders<IonicDatabaseBuilderModule> {
    return {
        ngModule: IonicDatabaseBuilderModule,
        providers: [
            { provide: DatabaseSettingsFactoryContract, useClass: settingsProvider },
            { provide: DATABASE_CREATOR, useClass: databaseCreatorProvider },
            { provide: DATABASE_MIGRATION, useClass: databaseMigrationContract },
            { provide: IS_ENABLE_LOG, useValue: isEnableLogProvider },
            { provide: PLATFORM_LOAD, useClass: platformLoad },
            { provide: IS_AVAILABLE_DATABASE, useValue: isAvailableProvider },
        ]
    };
}
}
