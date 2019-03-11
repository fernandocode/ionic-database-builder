import { DatabaseCreatorContract } from 'database-builder';
import { NgModule, Type, ModuleWithProviders } from '@angular/core';
// import { IonicDatabaseBuilderComponent } from './ionic-database-builder.component';
import { DatabaseMigrationContract } from './services/database-migration-contract';
import { DatabaseSettingsFactoryContract } from './utils/database-settings-factory-contract';
import { IS_AVAILABLE_DATABASE, DATABASE_CREATOR, IS_ENABLE_LOG, DATABASE_MIGRATION } from './utils/dependency-injection-definition';
import { Database } from './services/database';
import { DatabaseMigration } from './services/database-migration';
import { DatabaseHelperService } from './services/database-helper-service';
import { DatabaseFactoryDefault } from './defaults/database-factory-default';
import { DatabaseFactoryContract } from './utils/database-factory-contract';

@NgModule({
  // // declarations: [IonicDatabaseBuilderComponent],
  // imports: [
  // ],
  // // exports: [IonicDatabaseBuilderComponent],
  // providers: [
  //   // DatabaseMigration,
  //   // Database,
  //   // DatabaseHelperService,
  //   // {
  //   //   provide: DATABASE_FACTORY,
  //   //   useClass: DatabaseFactoryDefault
  //   // }
  // ]
})
export class IonicDatabaseBuilderModule {

  public static forRoot(
    settingsProvider: Type<DatabaseSettingsFactoryContract>,
    isAvailableProvider: boolean,
    databaseCreatorProvider: Type<DatabaseCreatorContract>,
    isEnableLogProvider: boolean,
    databaseMigrationContract: Type<DatabaseMigrationContract>
  ): ModuleWithProviders {
    return {
      ngModule: IonicDatabaseBuilderModule,
      providers: [
        { provide: DatabaseSettingsFactoryContract, useClass: settingsProvider },
        { provide: IS_AVAILABLE_DATABASE, useValue: isAvailableProvider },
        { provide: DATABASE_CREATOR, useClass: databaseCreatorProvider },
        { provide: IS_ENABLE_LOG, useValue: isEnableLogProvider },
        { provide: DATABASE_MIGRATION, useClass: databaseMigrationContract },

        DatabaseMigration,
        Database,
        DatabaseHelperService,
        {
          provide: DatabaseFactoryContract,
          useClass: DatabaseFactoryDefault
        }
      ]
    };
  }
}
