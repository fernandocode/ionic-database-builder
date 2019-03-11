import { DatabaseObject } from "database-builder";
import { Observable } from "rxjs";

export interface DatabaseResettableContract{
    reset(database: DatabaseObject): Observable<any>;
}
