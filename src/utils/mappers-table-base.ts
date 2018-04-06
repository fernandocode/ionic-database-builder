import { GetMapper, MetadataTable } from "database-builder";
import { Injectable } from "@angular/core";

export abstract class MappersTableBase implements GetMapper {

    constructor() {

    }

    public abstract getMapper<T>(tKey: new () => T): MetadataTable<T>;
    public abstract forEachMapper(callbackfn: (value: MetadataTable<any>, key: string, map: Map<string, MetadataTable<any>>) => void, thisArg?: any): void;
}
