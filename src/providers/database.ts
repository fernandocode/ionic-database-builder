import { DATABASE_NAME, VERSION } from "./../dependency-injection-definition";
import { Inject, Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Platform } from "ionic-angular";
import { BuildableDatabaseManager } from "../utils/buildable-database-manager";
import { GetMapper } from "database-builder";

@Injectable()
export class Database extends BuildableDatabaseManager {
    constructor(
        @Inject(VERSION) private _version: number,
        @Inject(DATABASE_NAME) private _databaseName: string,
        platform: Platform,
        sqlite: SQLite,
        getMapper: GetMapper
    ) {
        super(platform, sqlite, getMapper);
    }

    // protected migrationVersion(database: SQLiteObject, version: number): Promise<boolean> {
    //     return this._migrationDatabase.version(database, version);
    // }

    protected migrationVersion(database: SQLiteObject, version: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    protected databaseName(): string {
        return this._databaseName;
    }

    public version(): number {
        return this._version;
    }
}
