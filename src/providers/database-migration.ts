import { Version } from "./../model/version-model";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { Alert, App, Config } from "ionic-angular";
import { Injectable, Optional } from "@angular/core";
import { SQLiteTransaction } from "@ionic-native/sqlite";
import { Ddl, GetMapper } from "database-builder";
import { MigrationDatabaseBase } from "../utils/migration-database-base";
import { DatabaseMigrationContract } from "./database-migration-contract";

@Injectable()
export class DatabaseMigration extends MigrationDatabaseBase {

    constructor(
        private _mappersTable: GetMapper,
        app: App,
        config: Config,
        @Optional() private _databaseMigrationContract: DatabaseMigrationContract
    ) {
        super(
            app, config
        );
    }

    public databaseReset(transation: SQLiteTransaction, version: Version): Observable<any> {

        // tslint:disable-next-line:no-console
        console.info("database reset");

        const observablesWait: Array<Observable<any>> = [];

        // remove dados offline da versão anterior, pois o formato dos dados foi alterado de uma versão para a outra
        const ddl = new Ddl(transation, this._mappersTable, true);
        this._mappersTable.forEachMapper((value, key) => {
            if (!value.readOnly) {
                observablesWait.push(Observable.fromPromise(ddl.drop(value.newable).execute()));
                observablesWait.push(Observable.fromPromise(ddl.create(value.newable).execute()));
            }
        });

        return Observable.forkJoin(observablesWait);
    }

    protected migrationExecute(transation: SQLiteTransaction, version: Version): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            let observablesNested: Array<Observable<any>> = [];
            if (this._databaseMigrationContract) {
                const toObservables = this._databaseMigrationContract.to(version);
                if (toObservables && toObservables.length > 0) {
                    observablesNested = observablesNested.concat(toObservables);
                }
            }

            if (observablesNested.length === 0 && version.oldVersion < 1) {
                observablesNested.push(this.databaseReset(transation, version));
            }

            this.callNested(observablesNested, 0).subscribe(result => {
                resolve(result);
            }, error => reject(error));
        });
    }

    private callNested(observablesNested: Array<Observable<any>>, nextIndex: number): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            if (observablesNested.length > nextIndex) {
                observablesNested[nextIndex].subscribe(result => {
                    this.callNested(observablesNested, ++nextIndex).subscribe(_ => {
                        observer.next(true);
                        observer.complete();
                    }, error => {
                        observer.error(error);
                        observer.complete();
                    });
                });
            } else {
                observer.next(true);
                observer.complete();
            }
        });
    }

}
