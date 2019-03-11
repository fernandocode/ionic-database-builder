import { DatabaseMigration } from "./providers/database-migration";
import { DATABASE_CREATOR, IS_AVAILABLE_DATABASE, IS_ENABLE_LOG, DATABASE_MIGRATION } from "./dependency-injection-definition";
import { ModuleWithProviders, NgModule, Type } from "@angular/core";
import { DatabaseHelperService } from "./providers/database-helper-service";
import { DatabaseMigrationContract } from "./providers/database-migration-contract";
import { Database } from "./providers/database";
import { DatabaseSettingsFactoryContract } from "./utils/database-settings-factory-contract";
import { DatabaseFactoryContract } from "./utils/database-factory-contract";
import { DatabaseFactoryDefault } from "./defaults/database-factory-default";
import { DatabaseCreatorContract } from "database-builder";

// @NgModule({
//     // providers: [
//     //     // DatabaseMigration,
//     //     Database,
//     //     // DatabaseHelperService,
//     //     // {
//     //     //     provide: DatabaseFactoryContract,
//     //     //     useClass: DatabaseFactoryDefault
//     //     // }
//     // ]
// })
@NgModule()
// https://stackblitz.com/edit/ionic-j3f3ym
export class DatabaseModule {
    
    public static forRoot(
        settingsProvider: Type<DatabaseSettingsFactoryContract>,
        isAvailableProvider: boolean,
        databaseCreatorProvider: Type<DatabaseCreatorContract>,
        isEnableLogProvider: boolean,
        databaseMigrationContract: Type<DatabaseMigrationContract>
    ): ModuleWithProviders {
        return {
            ngModule: DatabaseModule,
            providers: [
                { provide: DatabaseSettingsFactoryContract, useClass: settingsProvider },
                { provide: IS_AVAILABLE_DATABASE, useValue: isAvailableProvider },
                { provide: DATABASE_CREATOR, useClass: databaseCreatorProvider },
                { provide: IS_ENABLE_LOG, useValue: isEnableLogProvider },
                { provide: DATABASE_MIGRATION, useClass: databaseMigrationContract }
            ]
        };
        // return this.forBase();
    }
    
    // public static forRoot(
    //     settingsProvider: Type<DatabaseSettingsFactoryContract>,
    //     isAvailableProvider: boolean,
    //     databaseCreatorProvider: Type<DatabaseCreatorContract>,
    //     isEnableLogProvider: boolean,
    //     databaseMigrationContract: Type<DatabaseMigrationContract>
    // ): ModuleWithProviders {
    //     return {
    //         ngModule: DatabaseModule,
    //         providers: [
    //             { provide: DatabaseSettingsFactoryContract, useClass: settingsProvider },
    //             { provide: IS_AVAILABLE_DATABASE, useValue: isAvailableProvider },
    //             { provide: DATABASE_CREATOR, useClass: databaseCreatorProvider },
    //             { provide: IS_ENABLE_LOG, useValue: isEnableLogProvider },
    //             { provide: DATABASE_MIGRATION, useClass: databaseMigrationContract }
    //         ]
    //     };
    //     // return this.forBase();
    // }

    // public static forRoot(
    //     settingsProvider: ProviderTyped<DatabaseSettingsFactoryContract>,
    //     isAvailableProvider: ProviderTyped<boolean>,
    //     databaseCreatorProvider: ProviderTyped<DatabaseCreatorContract>,
    //     isEnableLogProvider: ProviderTyped<boolean>,
    //     databaseMigrationContract?: Type<DatabaseMigrationContract>
    // ): ModuleWithProviders {
    //     const providers: Provider[] = [
    //         this.createProvider(DatabaseSettingsFactoryContract, settingsProvider),
    //         this.createProvider(IS_AVAILABLE_DATABASE, isAvailableProvider),
    //         this.createProvider(DATABASE_CREATOR, databaseCreatorProvider),
    //         this.createProvider(IS_ENABLE_LOG, isEnableLogProvider),
    //     ];
    //     return this.forBase(providers, databaseMigrationContract);
    // }

    // private static createProvider(provide: any, provider: ProviderTyped<any>): Provider {
    //     return Object.assign({
    //         provide: provide
    //     }, provider);
    // }

    // private static forBase(
    //     providers: Provider[],
    //     databaseMigrationContract?: Type<DatabaseMigrationContract>
    // ): ModuleWithProviders {
    //     if (databaseMigrationContract) {
    //         providers.push({
    //             provide: DatabaseMigrationContract,
    //             useClass: databaseMigrationContract
    //         });
    //     }
    //     return {
    //         ngModule: DatabaseModule,
    //         providers: providers
    //     };
    // }
}
