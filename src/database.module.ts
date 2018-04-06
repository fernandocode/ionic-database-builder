import { DATABASE_NAME, VERSION } from "./dependency-injection-definition";
import { Observable } from "rxjs";
import { ModuleWithProviders, NgModule, Provider, Type } from "@angular/core";
import { DatabaseHelperService } from "./utils/database-helper-service";
import { DatabaseMigrationContract } from "./providers/database-migration-contract";
import { DatabaseMigration } from "./providers/database-migration";
import { Database } from "./providers/database";
import { MappersTableBase } from ".";
import { DatabaseNameFactory } from "./utils/database-name-factory";

@NgModule({
    providers: [
        DatabaseMigration,
        Database,
        DatabaseMigrationContract
    ]
})
export class DatabaseModule {
    // https://stackblitz.com/edit/ionic-j3f3ym
    public static forRoot(
        version: number,
        databaseNameFactory: DatabaseNameFactory,
        mapper: Type<MappersTableBase>,
        databaseMigrationContract?: Type<DatabaseMigrationContract>
    ): ModuleWithProviders {
        const providers: Provider[] = [
            DatabaseHelperService,
            DatabaseMigrationContract,
            {
                provide: VERSION,
                useValue: version
            },
            {
                provide: DATABASE_NAME,
                useFactory: databaseNameFactory.useFactory,
                deps: databaseNameFactory.deps
            },
            {
                provide: MappersTableBase,
                useClass: mapper
            }
        ];
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
