import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { DatabaseTransaction } from 'database-builder';
import { DatabaseMigrationContract, MappersTableBase, Version } from '../..';

@Injectable()
export class DatabaseMigrationService extends DatabaseMigrationContract {

    public to(version: Version, transation: DatabaseTransaction, mappers: MappersTableBase): Observable<any>[] {
        const observablesNested: Observable<any>[] = [];

        // if (version.oldVersion < 2.0) {
        //     observablesNested.push(this.migration_v2_0(transation, version, mappers));
        // }

        return observablesNested;
    }
}