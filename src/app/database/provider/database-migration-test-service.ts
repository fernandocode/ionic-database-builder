import { GetMapper, DatabaseObject } from 'database-builder';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseMigrationContract, DatabaseResettableContract, Version } from 'projects/ionic-database-builder/src/lib';

export enum MigrationStatus {
    Started,
    Finished
}

@Injectable()
export class MigrationFlowService {

    public $statusEvent: EventEmitter<MigrationStatus> = new EventEmitter();

    private _status: MigrationStatus;

    public get status(): MigrationStatus {
        return this._status;
    }

    public set status(v: MigrationStatus) {
        // console.log(`update status: ${v === MigrationStatus.Started ? 'Started' : 'Finished'}`);
        this._status = v;
        this.$statusEvent.emit(v);
    }

}

@Injectable()
export class DatabaseMigrationTestService extends DatabaseMigrationContract {

    constructor(private flow: MigrationFlowService) {
        super();
    }

    public onStart() {
        this.flow.status = MigrationStatus.Started;
    }

    public onFinish() {
        this.flow.status = MigrationStatus.Finished;
    }

    public to(
        version: Version,
        database: DatabaseObject,
        mappers: GetMapper,
        resettable: DatabaseResettableContract
    ): Observable<any>[] {
        const observablesNested: Observable<any>[] = [];

        if (!(window as any)._resetCalled) {
            observablesNested.push(resettable.reset(database));
            console.log('start resetable');
            (window as any)._resetCalled = true;
        }

        return observablesNested;
    }
}
