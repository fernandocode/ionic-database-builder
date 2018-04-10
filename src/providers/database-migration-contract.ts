import { MappersTableBase } from "..";
import { Injectable } from "@angular/core";
import { Version } from "./../model/version-model";
import { Observable } from "rxjs/Observable";
import { SQLiteTransaction } from "@ionic-native/sqlite";

@Injectable()
export abstract class DatabaseMigrationContract {

    public abstract to(
        version: Version,
        transation: SQLiteTransaction,
        mappers: MappersTableBase
    ): Array<Observable<any>>;
}
