import { Injectable } from "@angular/core";
import { Version } from "./../model/version-model";
import { Observable } from "rxjs/Observable";
import { DatabaseTransaction, GetMapper } from "database-builder";
import { DatabaseResettableContract } from "./database-resettable-contract";

@Injectable()
export abstract class DatabaseMigrationContract {

    public abstract to(
        version: Version,
        transation: DatabaseTransaction,
        mappers: GetMapper,
        resettable: DatabaseResettableContract
    ): Array<Observable<any>>;
}
