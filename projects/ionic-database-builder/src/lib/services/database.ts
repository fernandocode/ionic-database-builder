import { DatabaseMigration } from './database-migration';
import { Inject, Injectable, Injector } from '@angular/core';
import { BuildableDatabaseManager } from '../utils/buildable-database-manager';
import { DatabaseFactoryContract } from '../utils/database-factory-contract';
import { DatabaseObject } from 'database-builder';
import { Observable, Observer } from 'rxjs';
import { IS_AVAILABLE_DATABASE, IS_ENABLE_LOG, PLATFORM_LOAD } from '../utils/dependency-injection-definition';
import { DatabaseSettingsFactoryContract } from '../utils/database-settings-factory-contract';
import { PlatformLoad } from '../utils/platform-load';

@Injectable()
export class Database extends BuildableDatabaseManager {

    constructor(
        @Inject(IS_AVAILABLE_DATABASE) private _isAvailable: boolean,
        @Inject(IS_ENABLE_LOG) isEnableLog: boolean,
        databaseSettings: DatabaseSettingsFactoryContract,
        injector: Injector,
        databaseFactory: DatabaseFactoryContract,
        private _databaseMigration: DatabaseMigration,
        @Inject(PLATFORM_LOAD) platformLoad: PlatformLoad
    ) {
        super(
            databaseFactory,
            databaseSettings,
            injector,
            databaseSettings.mapper(injector),
            platformLoad,
            isEnableLog
        );
    }

    protected migrationVersion(database: DatabaseObject, version: number): Observable<boolean> {
        if (this._isAvailable) {
            return this._databaseMigration.version(database, version);
        }
        return new Observable((observer: Observer<boolean>) => {
            observer.next(true);
            observer.complete();
        });
    }

    protected databaseName(): string {
        return this._databaseSettings.databaseName(this._injector);
    }

    public version(): number {
        return this._databaseSettings.version(this._injector);
    }

    public databaseNameFile(databaseName: string = this.databaseName()): string {
        return this.addDatabaseNameExtension(this.cleanDatabaseName(databaseName));
    }
}
