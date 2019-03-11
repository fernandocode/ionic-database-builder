import { Inject } from "@angular/core";
import { DatabaseFactoryContract } from "../utils/database-factory-contract";
import { DATABASE_CREATOR, IS_AVAILABLE_DATABASE } from "../dependency-injection-definition";
import { DatabaseObject, DatabaseCreatorContract } from "database-builder";
import { Observable, Observer } from "rxjs";

export class DatabaseFactoryDefault extends DatabaseFactoryContract {

    constructor(
        @Inject(IS_AVAILABLE_DATABASE) private _isAvailable: boolean,
        @Inject(DATABASE_CREATOR) private _databaseCreator: DatabaseCreatorContract
    ) {
        super();
    }

    public database(databaseName: string): Observable<DatabaseObject> {
        return Observable.create((observer: Observer<DatabaseObject>) => {
            if (this._isAvailable) {
                this._databaseCreator.create({
                    name: databaseName,
                    location: "default"
                })
                    .then(database => {
                        observer.next(database);
                        observer.complete();
                    })
                    .catch(err => {
                        observer.error(err);
                        observer.complete();
                    });
            } else {
                observer.next(void 0);
                observer.complete();
            }
        });
    }
}
