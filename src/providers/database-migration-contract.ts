import { MappersTableBase } from "..";
import { Injectable } from "@angular/core";
import { Version } from "./../model/version-model";
import { Observable } from "rxjs/Observable";
import { DatabaseTransaction } from "database-builder";

@Injectable()
export abstract class DatabaseMigrationContract {

    public abstract to(
        version: Version,
        transation: DatabaseTransaction,
        mappers: MappersTableBase
    ): Array<Observable<any>>;
}
