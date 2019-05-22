import { Version } from './../model/version-model';
import { Injectable, Injector, Optional, Inject } from '@angular/core';
import { Ddl, DatabaseObject, forkJoinSafe } from 'database-builder';
import { DatabaseMigrationContract } from './database-migration-contract';
import { DatabaseMigrationBase } from '../utils/database-migration-base';
import { DatabaseResettableContract } from './database-resettable-contract';
import { DatabaseSettingsFactoryContract } from '../utils/database-settings-factory-contract';
import { Observable, Observer } from 'rxjs';
import { DATABASE_MIGRATION } from '../utils/dependency-injection-definition';

@Injectable()
export class DatabaseMigration extends DatabaseMigrationBase implements DatabaseResettableContract {

    private _settings: DatabaseSettingsFactoryContract;

    constructor(
        private _injector: Injector,
        @Optional() @Inject(DATABASE_MIGRATION) private _databaseMigrationContract: DatabaseMigrationContract
    ) {
        super();
        this._settings = _injector.get(DatabaseSettingsFactoryContract);
    }

    public reset(database: DatabaseObject): Observable<any> {

        // tslint:disable-next-line:no-console
        console.info('database reset');

        const observablesWait: Array<Observable<any>> = [];

        const mappers = this._settings.mapper(this._injector);

        // remove dados offline da versão anterior, pois o formato dos dados foi alterado de uma versão para a outra
        const ddl = new Ddl(database, mappers, true);
        mappers.forEachMapper((value, key) => {
            if (!value.readOnly) {
                observablesWait.push(ddl.drop(value.newable).execute());
                observablesWait.push(ddl.create(value.newable).execute());
            }
        });

        return forkJoinSafe(observablesWait);
    }

    protected migrationExecute(database: DatabaseObject, version: Version): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {

            let observablesNested: Array<Observable<any>> = [];
            if (this._databaseMigrationContract) {
                const toObservables = this._databaseMigrationContract.to(
                    version,
                    database,
                    this._settings.mapper(this._injector),
                    this
                );
                if (toObservables && toObservables.length > 0) {
                    observablesNested = observablesNested.concat(toObservables);
                }
            }

            if (observablesNested.length === 0 && version.oldVersion < 1) {
                observablesNested.push(this.reset(database));
            }

            this.callNested(observablesNested, 0)
                .subscribe((result: boolean) => {
                    observer.next(result);
                    observer.complete();
                }, (error: any) => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    private callNested(observablesNested: Array<Observable<any>>, nextIndex: number): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            if (observablesNested.length > nextIndex) {
                observablesNested[nextIndex].subscribe((result: any) => {
                    this.callNested(observablesNested, ++nextIndex).subscribe((_: any) => {
                        observer.next(true);
                        observer.complete();
                    }, (error: any) => {
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
