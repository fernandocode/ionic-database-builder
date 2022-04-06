import { GetMapper, DatabaseObject } from 'database-builder';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseMigrationContract, DatabaseResettableContract, Version } from 'projects/ionic-database-builder/src/lib';

@Injectable()
export class DatabaseMigrationService extends DatabaseMigrationContract {

    public to(
        version: Version,
        database: DatabaseObject,
        mappers: GetMapper,
        resettable: DatabaseResettableContract
    ): Observable<any>[] {
        const observablesNested: Observable<any>[] = [];

        if (!(window as any)._resetCalled) {
            // resettable.reset(database).subscribe(sub => {}, err => console.error(err));
            observablesNested.push(resettable.reset(database));
            console.log('start resetable');
            (window as any)._resetCalled = true;
        }

        return observablesNested;
    }
}
