import { DatabaseTransaction } from "database-builder";
import { Observable } from "rxjs/Observable";

export interface DatabaseResettableContract{
    reset(transation: DatabaseTransaction): Observable<any>;
}
