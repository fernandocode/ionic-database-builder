import { DATABASE_NAME, VERSION } from "./dependency-injection-definition";
import { Observable } from "rxjs";
import { ModuleWithProviders, NgModule, Provider } from "@angular/core";
import { DatabaseHelperService } from "./utils/database-helper-service";
import { DatabaseMigrationContract } from "./providers/database-migration-contract";
import { DatabaseMigration } from "./providers/database-migration";
import { Database } from "./providers/database";

@NgModule({
    declarations: [
    ],
    exports: [
        Database
    ],
    providers: [
        DatabaseMigration,
        Database
    ]
})
export class DatabaseModule {
    // https://stackblitz.com/edit/ionic-j3f3ym
    public static forRoot(
        version: number,
        databaseName: string,
        databaseMigrationContract?: new () => DatabaseMigrationContract
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
                useValue: databaseName
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
