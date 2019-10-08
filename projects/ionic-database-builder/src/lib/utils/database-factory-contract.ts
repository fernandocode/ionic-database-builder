import { DatabaseObject } from 'database-builder';
import { Observable } from 'rxjs';

export abstract class DatabaseFactoryContract {

    public abstract database(databaseName: string): Observable<DatabaseObject>;

}
