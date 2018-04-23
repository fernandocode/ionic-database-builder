import { DatabaseSettingsFactoryContract } from "..";
import { Version } from "./../model/version-model";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector, Optional } from "@angular/core";
import { DatabaseTransaction, Ddl } from "database-builder";
import { DatabaseMigrationContract } from "./database-migration-contract";
import { DatabaseMigrationBase } from "../utils/database-migration-base";
import { DatabaseResettableContract } from "./database-resettable-contract";

@Injectable()
export class DatabaseMigration extends DatabaseMigrationBase implements DatabaseResettableContract{

    private _settings: DatabaseSettingsFactoryContract;

    constructor(
        private _injector: Injector,
        @Optional() private _databaseMigrationContract: DatabaseMigrationContract
    ) {
        super();
        this._settings = _injector.get(DatabaseSettingsFactoryContract);
    }

    public reset(transation: DatabaseTransaction): Observable<any> {

        // tslint:disable-next-line:no-console
        console.info("database reset");

        const observablesWait: Array<Observable<any>> = [];

        const mappers = this._settings.mapper(this._injector);

        // remove dados offline da versão anterior, pois o formato dos dados foi alterado de uma versão para a outra
        const ddl = new Ddl(transation, mappers, true);
        mappers.forEachMapper((value, key) => {
            if (!value.readOnly) {
                observablesWait.push(Observable.fromPromise(ddl.drop(value.newable).execute()));
                observablesWait.push(Observable.fromPromise(ddl.create(value.newable).execute()));
            }
        });

        return Observable.forkJoin(observablesWait);
    }

    protected migrationExecute(transation: DatabaseTransaction, version: Version): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            let observablesNested: Array<Observable<any>> = [];
            if (this._databaseMigrationContract) {
                const toObservables = this._databaseMigrationContract.to(
                    version, 
                    transation, 
                    this._settings.mapper(this._injector),
                    this
                );
                if (toObservables && toObservables.length > 0) {
                    observablesNested = observablesNested.concat(toObservables);
                }
            }

            if (observablesNested.length === 0 && version.oldVersion < 1) {
                observablesNested.push(this.reset(transation));
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
