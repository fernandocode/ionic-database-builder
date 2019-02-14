import { DatabaseBaseTransaction, DatabaseResult } from "database-builder";
import { DatabaseManager } from "./database-manager";
import { Crud, DatabaseObject, Ddl, ExecutableBuilder, GetMapper, Query, QueryCompiled } from "database-builder";
import { DatabaseFactoryContract } from "./database-factory-contract";
import { Observable, Observer } from "rxjs";

export abstract class BuildableDatabaseManager extends DatabaseManager {

    constructor(
        databaseFactory: DatabaseFactoryContract,
        private _mapper: GetMapper,
        public enableLog: boolean = true
    ) {
        super(databaseFactory);
    }

    public get mapper(): GetMapper {
        return this._mapper;
    }

    public databaseInstance(): Observable<DatabaseObject> {
        const database = super.databaseInstance(this.databaseName(), this.version());
        if (!database) {
            throw new Error("SQLite not avaliable!");
        }
        return database;
    }

    public newTransaction(successTransaction: () => void): Observable<DatabaseBaseTransaction> {
        return Observable.create((observer: Observer<DatabaseBaseTransaction>) => {
            this.databaseInstance()
                .subscribe(database => {
                    database.transaction((result: DatabaseBaseTransaction) => {
                        observer.next(result);
                        observer.complete();
                    })
                        .then(x => {
                            successTransaction();
                        })
                        .catch(error => {
                            observer.error(error);
                            observer.complete();
                        });
                }, err => {
                    observer.error(err);
                    observer.complete();
                });
            // .catch(error => {
            //     reject(error);
            // });
        });
    }

    public transaction(successTransaction: () => void): Observable<Crud> {
        return Observable.create((observer: Observer<Crud>) => {
            // return new Promise((resolve, reject) => {
            this.newTransaction(successTransaction)
                .subscribe((transaction) => {
                    observer.next(new Crud(transaction, this._mapper, this.enableLog));
                    observer.complete();
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public beginTransaction(): Observable<Crud> {
        return Observable.create((observer: Observer<Crud>) => {
            this.sql("BEGIN TRANSACTION")
                .subscribe(r => {
                    this.crud()
                        .subscribe(crud => {
                            observer.next(crud);
                            observer.complete();
                        }, error => {
                            observer.error(error);
                            observer.complete();
                        });
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public commitTransaction(): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            // return new Promise((resolve, reject) => {
            this.sql("COMMIT")
                .subscribe(r => {
                    observer.next(true);
                    observer.complete();
                    // resolve(true);
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public rollbackTransaction(): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            // return new Promise((resolve, reject) => {
            this.sql("ROLLBACK")
                .subscribe(r => {
                    observer.next(true);
                    observer.complete();
                    // resolve(true);
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public crud(): Observable<Crud> {
        return Observable.create((observer: Observer<Crud>) => {
            // return new Promise((resolve, reject) => {
            this.databaseInstance()
                .subscribe(database => {
                    observer.next(new Crud(database, this._mapper, this.enableLog));
                    observer.complete();
                    // resolve(new Crud(database, this._mapper, this.enableLog));
                }, error => { observer.error(error); observer.complete(); });
        });
    }

    public sql(sql: string, params: any[] = []): Observable<DatabaseResult> {
        return Observable.create((observer: Observer<DatabaseResult>) => {
            // return new Promise((resolve, reject) => {
            this.databaseInstance()
                .subscribe(database => {
                    const executable = new ExecutableBuilder(this.enableLog);
                    executable.execute([{
                        query: sql,
                        params: params
                    } as QueryCompiled], database)
                        .subscribe((cursor: DatabaseResult[]) => {
                            observer.next(cursor[0]);
                            observer.complete();
                        }, err => {
                            observer.error(err);
                            observer.complete();
                        });
                }, err => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    public query<T>(typeT: new () => T, alias: string = void 0): Observable<Query<T>> {
        return Observable.create((observer: Observer<Query<T>>) => {
            // return new Promise((resolve, reject) => {
            this.databaseInstance()
                .subscribe(database => {
                    const that = this;
                    observer.next(new Query(typeT, alias,
                        (tKey: (new () => any) | string) => {
                            return that._mapper.get(tKey);
                        }, this._mapper.get(typeT).mapperTable, database, this.enableLog));
                    observer.complete();
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public ddl(): Observable<Ddl> {
        return Observable.create((observer: Observer<Ddl>) => {
            // return new Promise((resolve, reject) => {
            this.databaseInstance()
                .subscribe(database => {
                    observer.next(new Ddl(database, this._mapper, this.enableLog));
                    observer.complete();
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    protected abstract databaseName(): string;

    public abstract version(): number;
}
