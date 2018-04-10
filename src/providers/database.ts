import { DatabaseMigration } from "./database-migration";
import { Injectable, Injector } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Platform } from "ionic-angular";
import { BuildableDatabaseManager } from "../utils/buildable-database-manager";
import { DatabaseSettingsFactoryContract } from "..";

@Injectable()
export class Database extends BuildableDatabaseManager {
    constructor(
        private _injector: Injector,
        private _settings: DatabaseSettingsFactoryContract,
        platform: Platform,
        sqlite: SQLite,
        private _databaseMigration: DatabaseMigration
    ) {
        super(platform, sqlite,
            _settings.mapper(_injector)
        );
    }

    protected migrationVersion(database: SQLiteObject, version: number): Promise<boolean> {
        return this._databaseMigration.version(database, version);
    }

    protected databaseName(): string {
        return this._settings.databaseName(this._injector);
    }

    public version(): number {
        return this._settings.version(this._injector);
    }
}
