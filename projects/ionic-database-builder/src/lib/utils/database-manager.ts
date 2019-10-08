import { DatabaseFactoryContract } from './database-factory-contract';
import { DatabaseObject, DatabaseBuilderError } from 'database-builder';
import { Observable } from 'rxjs';
import { PlatformLoad } from './platform-load';

export abstract class DatabaseManager {

    private _databases: Map<string, Promise<DatabaseObject>> = new Map<string, Promise<DatabaseObject>>();

    constructor(
        protected databaseFactory: DatabaseFactoryContract,
        protected _platformLoad: PlatformLoad
    ) {

    }

    public cleanDatabaseName(name: string) {
        return name.replace(/([^a-z0-9]+)/gi, '-');
    }

    protected addDatabaseNameExtension(databaseName: string): string {
        return `${databaseName}.db`;
    }

    public databaseInstance(name: string, version: number): Promise<DatabaseObject> {
        const keyDatabaseName: string = name + version;
        return this._databases.has(keyDatabaseName)
            ? this._databases.get(keyDatabaseName)
            : this.setDatabase(keyDatabaseName,
                this.createDatabase(this.databaseNameFile(name), version));
    }

    public invalidateInstance() {
        this._databases = new Map<string, Promise<DatabaseObject>>();
    }

    public abstract databaseNameFile(databaseName?: string): string;

    protected abstract migrationVersion(database: DatabaseObject, version: number): Observable<boolean>;

    private setDatabase(keyDatabaseName: string, promiseDatabase: Promise<DatabaseObject>): Promise<DatabaseObject> {
        if (promiseDatabase) {
            return this._databases
                .set(keyDatabaseName, promiseDatabase)
                .get(keyDatabaseName);
        }
        throw new DatabaseBuilderError(`Connection with provider of database cannot be created!`);
    }

    private createDatabase(name: string, version: number): Promise<DatabaseObject> {
        return new Promise<DatabaseObject>((resolve, reject) => {
            this._platformLoad.ready()
                .then(() => {
                    this.databaseFactory.database(name)
                        .subscribe((database: DatabaseObject) => {
                            this.migrationVersion(database, version)
                                .subscribe(_ => {
                                    resolve(database);
                                }, err => {
                                    reject(err);
                                });
                        }, err => {
                            this.catchException(err);
                            reject(err);
                        });
                })
                .catch(err => {
                    this.catchException(err);
                    reject(err);
                });
        });
    }

    private catchException(e: any) {
        // tslint:disable-next-line:no-console
        console.error(e);
    }
}
