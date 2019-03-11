import { InjectionToken } from "@angular/core";
import { DatabaseCreatorContract } from "database-builder";
import { DatabaseMigrationContract } from '../services/database-migration-contract';
import { DatabaseFactoryContract } from './database-factory-contract';
import { DatabaseSettingsFactoryContract } from './database-settings-factory-contract';

export const IS_AVAILABLE_DATABASE = new InjectionToken<boolean>("is_available", 
// {
//     providedIn: 'root',
//     factory: () => true
// }
);
export const IS_ENABLE_LOG = new InjectionToken<boolean>("is_enable_log", 
// {
//     providedIn: 'root',
//     factory: () => true
// }
);
export const DATABASE_CREATOR = new InjectionToken<DatabaseCreatorContract>("database_creator");
export const DATABASE_MIGRATION = new InjectionToken<DatabaseMigrationContract>("database_migration");
// export const DATABASE_FACTORY = new InjectionToken<DatabaseFactoryContract>("database_factory", {
//     providedIn: 'root',
//     factory: () => void 0
// });
// export const DATABASE_SETTINGS_FACTORY = new InjectionToken<DatabaseSettingsFactoryContract>("database_settings_factory", {
//     providedIn: 'root',
//     factory: () => void 0
// });
