import { Version } from "./../model/version-model";
import { Observable } from "rxjs/Observable";

export interface DatabaseMigrationContract {

    to(version: Version): Array<Observable<any>>;
}
