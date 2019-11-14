import { DatabaseBaseTransaction, DatabaseResult } from 'database-builder';
import { DatabaseManager } from './database-manager';
import { Crud, DatabaseObject, Ddl, ExecutableBuilder, GetMapper, Query, QueryCompiled } from 'database-builder';
import { DatabaseFactoryContract } from './database-factory-contract';
import { Observable, Observer } from 'rxjs';
import { PlatformLoad } from './platform-load';

export abstract class BuildableDatabaseManager extends DatabaseManager {

    constructor(
        databaseFactory: DatabaseFactoryContract,
        private _mapper: GetMapper,
        platformLoad: PlatformLoad,
        public enableLog: boolean = true
    ) {
        super(databaseFactory, platformLoad);
    }

    public get mapper(): GetMapper {
        return this._mapper;
    }

    public databaseInstance(): Promise<DatabaseObject> {
        const database = super.databaseInstance(this.databaseName(), this.version());
        if (!database) {
            throw new Error('SQLite not avaliable!');
        }
        return database;
    }

    public newTransaction(successTransaction: () => void): Observable<DatabaseBaseTransaction> {
        return new Observable((observer: Observer<DatabaseBaseTransaction>) => {
            this.databaseInstance()
                .then(database => {
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
                })
                .catch(err => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    public transaction(successTransaction: () => void): Observable<Crud> {
        return new Observable((observer: Observer<Crud>) => {
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
        return new Observable((observer: Observer<Crud>) => {
            this.sql('BEGIN TRANSACTION')
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
        return new Observable((observer: Observer<boolean>) => {
            this.sql('COMMIT')
                .subscribe(r => {
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public rollbackTransaction(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            this.sql('ROLLBACK')
                .subscribe(r => {
                    observer.next(true);
                    observer.complete();
                }, error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public crud(): Observable<Crud> {
        return new Observable((observer: Observer<Crud>) => {
            this.databaseInstance()
                .then(database => {
                    observer.next(new Crud(database, this._mapper, this.enableLog));
                    observer.complete();
                })
                .catch(error => { observer.error(error); observer.complete(); });
        });
    }

    public batch(compiled: QueryCompiled[]): Observable<DatabaseResult[]> {
        return new Observable((observer: Observer<DatabaseResult[]>) => {
            this.databaseInstance()
                .then(database => {
                    const executable = new ExecutableBuilder(this.enableLog);
                    console.log('batch ::: ', database);
                    executable.executeBatch(compiled, database)
                        .subscribe((cursor: DatabaseResult[]) => {
                            observer.next(cursor);
                            observer.complete();
                        }, err => {
                            observer.error(err);
                            observer.complete();
                        });
                })
                .catch(err => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    public sql(sql: string, params: any[] = []): Observable<DatabaseResult> {
        return new Observable((observer: Observer<DatabaseResult>) => {
            this.databaseInstance()
                .then(database => {
                    const executable = new ExecutableBuilder(this.enableLog);
                    executable.execute([{
                        query: sql,
                        params
                    } as QueryCompiled], database)
                        .subscribe((cursor: DatabaseResult[]) => {
                            observer.next(cursor[0]);
                            observer.complete();
                        }, err => {
                            observer.error(err);
                            observer.complete();
                        });
                })
                .catch(err => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    public query<T>(typeT: new () => T, alias: string = void 0): Observable<Query<T>> {
        return new Observable((observer: Observer<Query<T>>) => {
            this.databaseInstance()
                .then(database => {
                    const that = this;
                    observer.next(new Query(typeT, alias,
                        (tKey: (new () => any) | string) => {
                            return that._mapper.get(tKey);
                        }, this._mapper.get(typeT).mapperTable, database, this.enableLog));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    public ddl(): Observable<Ddl> {
        return new Observable((observer: Observer<Ddl>) => {
            this.databaseInstance()
                .then(database => {
                    observer.next(new Ddl(database, this._mapper, this.enableLog));
                    observer.complete();
                })
                .catch(error => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    protected abstract databaseName(): string;

    public abstract version(): number;
}
