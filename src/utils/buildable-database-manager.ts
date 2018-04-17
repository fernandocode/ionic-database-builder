import { DatabaseResult } from "database-builder";
import { DatabaseManager } from "./database-manager";
import { Crud, DatabaseObject, DatabaseTransaction, Ddl, ExecutableBuilder, Query, QueryCompiled } from "database-builder";
import { MappersTableBase } from "../utils/mappers-table-base";
import { DatabaseFactoryContract } from "./database-factory-contract";

export abstract class BuildableDatabaseManager extends DatabaseManager {

    constructor(
        databaseFactory: DatabaseFactoryContract,
        private _mapper: MappersTableBase,
        public enableLog: boolean = true
    ) {
        super(databaseFactory);
    }

    public get mapper(): MappersTableBase {
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

    public crud(): Promise<Crud> {
        return new Promise((resolve, reject) => {
            this.databaseInstance().then(database => {
                resolve(new Crud(database, this._mapper, this.enableLog));
            })
                .catch(reject);
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
                    resolve(new Query(typeT, alias, this._mapper.getMapper(typeT), database, this.enableLog));
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
