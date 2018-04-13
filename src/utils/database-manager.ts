import { DatabaseFactoryContract } from "./database-factory-contract";
import { DatabaseObject } from "database-builder";

export abstract class DatabaseManager {

    private _databases: Map<string, Promise<DatabaseObject>> = new Map<string, Promise<DatabaseObject>>();

    constructor(
        // protected _platform: Platform, private _sqlite: SQLite
        protected databaseFactory: DatabaseFactoryContract
    ) {

    }

    public cleanDatabaseName(name: string) {
        return name.replace(/([^a-z0-9]+)/gi, "-");
    }

    protected addDatabaseNameExtension(databaseName: string): string {
        return `${databaseName}.db`;
    }

    public databaseInstance(name: string, version: number): Promise<DatabaseObject> {
        const keyDatabaseName: string = name + version;
        return this._databases.has(keyDatabaseName)
            ? this._databases.get(keyDatabaseName)
            : this._databases.set(keyDatabaseName,
                this.createDatabase(this.addDatabaseNameExtension(this.cleanDatabaseName(name)), version))
                .get(keyDatabaseName);
    }

    public invalidateInstance() {
        this._databases = new Map<string, Promise<DatabaseObject>>();
    }

    protected abstract migrationVersion(database: DatabaseObject, version: number): Promise<boolean>;

    private createDatabase(name: string, version: number): Promise<DatabaseObject> {
        return new Promise<DatabaseObject>((resolve, reject) => {
            this.databaseFactory.database()
                .then((database: DatabaseObject) => {
                    this.migrationVersion(database, version)
                        .then(_ => resolve(database))
                        .catch(er => reject(er));
                }).catch(error => {
                    this.catchException(error);
                    reject(error);
                });

        });
        // return new Promise<DatabaseObject>((resolve, reject) => {
        //     if (this._platform.is('cordova')) {
        //         const db = this._sqlite.create({
        //             name: name,
        //             location: 'default'
        //         });
        //         db.then((database: DatabaseObject) => {
        //             this.migrationVersion(database, version)
        //                 .then(_ => resolve(db))
        //                 .catch(er => reject(er));
        //         }).catch(error => {
        //             this.catchException(error);
        //             reject(error);
        //         });
        //     } else {
        //         resolve(void 0);
        //     }
        // });
    }

    private catchException(e: any) {
        // tslint:disable-next-line:no-console
        console.error(e);
    }
}
