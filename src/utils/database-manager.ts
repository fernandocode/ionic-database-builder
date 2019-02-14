import { DatabaseFactoryContract } from "./database-factory-contract";
import { DatabaseObject } from "database-builder";
import { Observable, Observer } from "rxjs";

export abstract class DatabaseManager {

    private _databases: Map<string, Observable<DatabaseObject>> = new Map<string, Observable<DatabaseObject>>();

    constructor(
        protected databaseFactory: DatabaseFactoryContract
    ) {

    }

    public cleanDatabaseName(name: string) {
        return name.replace(/([^a-z0-9]+)/gi, "-");
    }

    protected addDatabaseNameExtension(databaseName: string): string {
        return `${databaseName}.db`;
    }

    public databaseInstance(name: string, version: number): Observable<DatabaseObject> {
        const keyDatabaseName: string = name + version;
        return this._databases.has(keyDatabaseName)
            ? this._databases.get(keyDatabaseName)
            : this._databases.set(keyDatabaseName,
                this.createDatabase(this.databaseNameFile(name), version))
                .get(keyDatabaseName);
    }

    public invalidateInstance() {
        this._databases = new Map<string, Observable<DatabaseObject>>();
    }

    public abstract databaseNameFile(databaseName?: string): string;

    protected abstract migrationVersion(database: DatabaseObject, version: number): Observable<boolean>;

    private createDatabase(name: string, version: number): Observable<DatabaseObject> {
        return Observable.create((observer: Observer<DatabaseObject>) => {
            // return new Promise<DatabaseObject>((resolve, reject) => {
            this.databaseFactory.database(name)
                .subscribe((database: DatabaseObject) => {
                    this.migrationVersion(database, version)
                        .subscribe(_ => {
                            observer.next(database);
                            observer.complete();
                        }, err => {
                            observer.error(err);
                            observer.complete();
                        });
                }, err => {
                    this.catchException(err);
                    observer.error(err);
                    observer.complete();
                });

        });
    }

    private catchException(e: any) {
        // tslint:disable-next-line:no-console
        console.error(e);
    }
}
