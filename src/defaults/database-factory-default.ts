import { Inject } from "@angular/core";
import { MappersTableBase } from "..";
import { DatabaseSettingsModel } from "../model/database-settings-model";
import { DatabaseFactoryContract } from "../utils/database-factory-contract";
import { DATABASE_CREATOR, IS_AVAILABLE_DATABASE } from "../dependency-injection-definition";
import { DatabaseCreatorContract } from "../model/database-creator-contract";
import { DatabaseObject } from "database-builder";

export class DatabaseFactoryDefault extends DatabaseFactoryContract {

    constructor(
        @Inject(IS_AVAILABLE_DATABASE) private _isAvailable: boolean,
        @Inject(DATABASE_CREATOR) private _databaseCreator: DatabaseCreatorContract
    ) {
        super();
    }

    public database(): Promise<DatabaseObject> {
        return new Promise<DatabaseObject>((resolve, reject) => {
            if (this._isAvailable) {
                resolve(
                    this._databaseCreator.create({
                        name: name,
                        location: "default"
                    })
                );
            } else {
                resolve(void 0);
            }
        });
    }
}
