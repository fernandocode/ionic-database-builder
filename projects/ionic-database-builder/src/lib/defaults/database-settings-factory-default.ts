import { GetMapper } from 'database-builder';
import { Injector, Injectable } from "@angular/core";
import { DatabaseSettingsModel } from "../model/database-settings-model";
import { DatabaseSettingsFactoryContract } from 'ionic-database-builder';

@Injectable({
    providedIn: 'root'
})
export class DatabaseSettingsFactoryDefault extends DatabaseSettingsFactoryContract {

    private _model: DatabaseSettingsModel;

    constructor(
        versionOrModel: number | DatabaseSettingsModel,
        databaseName: string,
        mapper: GetMapper
    ) {
        super();
        if (Number.isInteger(versionOrModel as number)) {
            this._model = {
                version: versionOrModel as number,
                databaseName: databaseName,
                mapper: mapper
            };
        } else {
            this._model = versionOrModel as DatabaseSettingsModel;
        }
    }

    public databaseName(injector: Injector): string {
        return this._model.databaseName;
    }

    public version(injector: Injector): number {
        return this._model.version;
    }

    public mapper(): GetMapper {
        return this._model.mapper;
    }
}
