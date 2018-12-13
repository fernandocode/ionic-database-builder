import { GetMapper } from 'database-builder';
import { Injectable } from '@angular/core';
import { DatabaseTransaction } from 'database-builder';
import { DatabaseMigrationContract, Version } from '../..';
import { Observable } from 'rxjs';
import { DatabaseResettableContract } from '../../providers/database-resettable-contract';

@Injectable()
export class DatabaseMigrationService extends DatabaseMigrationContract {

    public to(version: Version, transation: DatabaseTransaction, mappers: GetMapper, resettable: DatabaseResettableContract): Observable<any>[] {
        const observablesNested: Observable<any>[] = [];

        if (!(window as any)._resetCalled) {
            resettable.reset(transation);
            (window as any)._resetCalled = true;
        }

        // if (version.oldVersion < 2.0) {
        //     observablesNested.push(this.migration_v2_0(transation, version, mappers));
        // }

        return observablesNested;
    }
}
