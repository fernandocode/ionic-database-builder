import { Observable } from "rxjs";
import { ModuleWithProviders, NgModule, Provider, Type } from "@angular/core";
import { DatabaseHelperService } from "./providers/database-helper-service";
import { DatabaseMigrationContract } from "./providers/database-migration-contract";
import { DatabaseMigration } from "./providers/database-migration";
import { Database } from "./providers/database";
import { DatabaseSettingsFactoryContract } from "./utils/database-settings-factory-contract";

@NgModule({
    providers: [
        DatabaseMigration,
        Database,
        DatabaseHelperService
    ]
})
// https://stackblitz.com/edit/ionic-j3f3ym
export class DatabaseModule {

    public static forRoot(
        settings: Type<DatabaseSettingsFactoryContract>,
        databaseMigrationContract?: Type<DatabaseMigrationContract>
    ): ModuleWithProviders {
        const providers: Provider[] = [
            {
                provide: DatabaseSettingsFactoryContract,
                useClass: settings
            }
        ];
        return this.forBase(providers);
    }

    public static forRootValue(
        settings: DatabaseSettingsFactoryContract,
        databaseMigrationContract?: Type<DatabaseMigrationContract>
    ): ModuleWithProviders {
        const providers: Provider[] = [
            {
                provide: DatabaseSettingsFactoryContract,
                useValue: settings
            }
        ];
        return this.forBase(providers);
    }

    private static forBase(
        providers: Provider[],
        databaseMigrationContract?: Type<DatabaseMigrationContract>
    ): ModuleWithProviders {
        if (databaseMigrationContract) {
            providers.push({
                provide: DatabaseMigrationContract,
                useClass: databaseMigrationContract
            });
        }
        return {
            ngModule: DatabaseModule,
            providers: providers
        };
    }
}
