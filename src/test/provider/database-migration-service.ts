import { GetMapper, DatabaseObject } from 'database-builder';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseResettableContract } from '../../providers/database-resettable-contract';
import { Version } from '../../model/version-model';
import { DatabaseMigrationContract } from '../../providers/database-migration-contract';

@Injectable()
export class DatabaseMigrationService extends DatabaseMigrationContract {

    public to(version: Version, database: DatabaseObject, mappers: GetMapper, resettable: DatabaseResettableContract): Observable<any>[] {
        const observablesNested: Observable<any>[] = [];

        if (!(window as any)._resetCalled) {
            resettable.reset(database);
            (window as any)._resetCalled = true;
        }

        // if (version.oldVersion < 2.0) {
        //     observablesNested.push(this.migration_v2_0(transation, version, mappers));
        // }

        return observablesNested;
    }
}
