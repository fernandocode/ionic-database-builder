import { DatabaseTransaction } from "database-builder";
import { Observable } from "rxjs";

export interface DatabaseResettableContract{
    reset(transation: DatabaseTransaction): Observable<any>;
}
