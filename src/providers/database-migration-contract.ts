import { Injectable } from "@angular/core";
import { Version } from "./../model/version-model";
import { GetMapper, DatabaseObject } from "database-builder";
import { DatabaseResettableContract } from "./database-resettable-contract";
import { Observable } from "rxjs";

@Injectable()
export abstract class DatabaseMigrationContract {

    public abstract to(
        version: Version,
        database: DatabaseObject,
        mappers: GetMapper,
        resettable: DatabaseResettableContract
    ): Array<Observable<any>>;
}
