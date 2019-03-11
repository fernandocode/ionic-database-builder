import { GetMapper, DatabaseObject } from "database-builder";
import { DatabaseResettableContract } from "./database-resettable-contract";
import { Observable } from "rxjs";
import { Version } from "../model/version-model";

export abstract class DatabaseMigrationContract {

    public abstract to(
        version: Version,
        database: DatabaseObject,
        mappers: GetMapper,
        resettable: DatabaseResettableContract
    ): Array<Observable<any>>;
}
