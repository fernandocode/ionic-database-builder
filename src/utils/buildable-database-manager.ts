import { DatabaseResult } from "database-builder";
import { DatabaseManager } from "./database-manager";
import { Crud, DatabaseObject, DatabaseTransaction, Ddl, ExecutableBuilder, GetMapper, Query, QueryCompiled } from "database-builder";
import { DatabaseFactoryContract } from "./database-factory-contract";

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

    public databaseInstance(): Promise<DatabaseObject> {
        const database = super.databaseInstance(this.databaseName(), this.version());
        if (!database) {
            throw new Error("SQLite not avaliable!");
        }
        return database;
    }

    public newTransaction(successTransaction: () => void): Promise<DatabaseTransaction> {
        return new Promise((resolve, reject) => {
            this.databaseInstance().then(database => {
                database.transaction((result: DatabaseTransaction) => {
                    resolve(result);
                })
                    .then(x => {
                        successTransaction();
                    })
                    .catch(error => {
                        reject(error);
                    });
            }, reject)
                .catch(error => {
                    reject(error);
                });
        });
    }

    public transaction(successTransaction: () => void): Promise<Crud> {
        return new Promise((resolve, reject) => {
            this.newTransaction(successTransaction)
                .then((transaction) => {
                    resolve(new Crud(transaction, this._mapper, this.enableLog));
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public beginTransaction(): Promise<Crud> {
        return new Promise((resolve, reject) => {
            this.sql("BEGIN TRANSACTION").then(r => {
                this.crud().then(crud => {
                    resolve(crud);
                }).catch(reject);
            }).catch(reject);
        });
    }

    public commitTransaction(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.sql("COMMIT").then(r => {
                resolve(true);
            }).catch(reject);
        });
    }

    public rollbackTransaction(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.sql("ROLLBACK").then(r => {
                resolve(true);
            }).catch(reject);
        });
    }

    public crud(): Promise<Crud> {
        return new Promise((resolve, reject) => {
            this.databaseInstance().then(database => {
                resolve(new Crud(database, this._mapper, this.enableLog));
            }).catch(reject);
        });
    }

    public sql(sql: string, params: any[] = []): Promise<DatabaseResult> {
        return new Promise((resolve, reject) => {
            this.databaseInstance().then(database => {
                const executable = new ExecutableBuilder(this.enableLog);
                executable.execute({
                    query: sql,
                    params: params
                } as QueryCompiled, database)
                    .then((cursor: DatabaseResult) => {
                        resolve(cursor);
                    });
            })
            .catch(reject);
        });
    }

    public query<T>(typeT: new () => T, alias: string = void 0): Promise<Query<T>> {
        return new Promise((resolve, reject) => {
            this.databaseInstance()
                .then(database => {
                    resolve(new Query(typeT, alias, this._mapper.get(typeT), database, this.enableLog));
                }, reject)
                .catch(reject);
        });
    }

    public ddl(): Promise<Ddl> {
        return new Promise((resolve, reject) => {
            this.databaseInstance().then(database => {
                resolve(new Ddl(database, this._mapper, this.enableLog));
            })
                .catch(reject);
        });
    }

    protected abstract databaseName(): string;

    public abstract version(): number;
}
