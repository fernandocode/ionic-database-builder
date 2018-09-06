import { DatabaseMigration } from "./database-migration";
import { Inject, Injectable, Injector } from "@angular/core";
import { BuildableDatabaseManager } from "../utils/buildable-database-manager";
import { DatabaseSettingsFactoryContract } from "..";
import { DatabaseFactoryContract } from "../utils/database-factory-contract";
import { DatabaseObject } from "database-builder";
import { IS_AVAILABLE_DATABASE } from "../dependency-injection-definition";

@Injectable()
export class Database extends BuildableDatabaseManager {

    private _settings: DatabaseSettingsFactoryContract;

    constructor(
        @Inject(IS_AVAILABLE_DATABASE) private _isAvailable: boolean,
        private _injector: Injector,
        databaseFactory: DatabaseFactoryContract,
        private _databaseMigration: DatabaseMigration
    ) {
        super(
            databaseFactory,
            _injector.get(DatabaseSettingsFactoryContract).mapper(_injector)
        );
        this._settings = _injector.get(DatabaseSettingsFactoryContract);
    }

    protected migrationVersion(database: DatabaseObject, version: number): Promise<boolean> {
        if (this._isAvailable) {
            return this._databaseMigration.version(database, version);
        }
        return new Promise<boolean>((resolve, reject) => {
            resolve(true);
        });
    }

    protected databaseName(): string {
        return this._settings.databaseName(this._injector);
    }

    public version(): number {
        return this._settings.version(this._injector);
    }

    public databaseNameFile(databaseName: string = this.databaseName()): string {
        return this.addDatabaseNameExtension(this.cleanDatabaseName(databaseName));
    }
}
