import { Injectable } from "@angular/core";
import { Version } from "./../model/version-model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class DatabaseMigrationContract {

    public to(version: Version): Array<Observable<any>> {
        return [];
    }
}
