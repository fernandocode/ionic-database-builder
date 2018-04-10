import { DatabaseHelper, MetadataTable } from "database-builder";
import { MappersTableBase } from "..";
import { MapperSettingsModel } from "../model/mapper-settings-model";

export class MappersTableSimple extends MappersTableBase {

    private _mappers: Map<string, MetadataTable<any>> = new Map<string, MetadataTable<any>>();

    constructor(
        private _databaseHelper: DatabaseHelper,
        protected _defaultSettings: MapperSettingsModel
    ) {
        super();
    }

    public mapper(
        readOnly?: boolean,
        keyColumn?: string,
        settings: MapperSettingsModel = this._defaultSettings,
        ...defaultsMapper: Array<new () => any>
    ): MappersTableSimple {
        defaultsMapper.forEach(mapper => {
            this.add(mapper, readOnly, keyColumn);
        });
        return this;
    }

    public add<T>(
        newable: new () => T,
        readOnly?: boolean,
        keyColumn?: string,
        settings: MapperSettingsModel = this._defaultSettings,
        advancedMapper: (metadata: MetadataTable<T>) => void = void 0
    ): MappersTableSimple {
        const metadata = new MetadataTable(newable, this._databaseHelper, readOnly, keyColumn)
            .autoMapper(
                settings.references,
                settings.referencesId,
                settings.referencesIdRecursive,
                settings.referencesIdColumn
            );
        if (advancedMapper) {
            advancedMapper(metadata);
        }
        this.push(metadata);
        return this;
    }

    public getMapper<T>(tKey: new () => T): MetadataTable<T> {
        return this._mappers.get(tKey.name);
    }

    public forEachMapper(
        callbackfn: (value: MetadataTable<any>, key: string, map: Map<string, MetadataTable<any>>) => void,
        thisArg?: any
    ): void {
        this._mappers.forEach(callbackfn);
    }

    private push(metadataTable: MetadataTable<any>): void {
        this._mappers.set(metadataTable.instance.constructor.name, metadataTable);
    }
}
