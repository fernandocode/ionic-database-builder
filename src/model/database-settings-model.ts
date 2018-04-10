import { MappersTableBase } from "..";

export interface DatabaseSettingsModel {
    version: number;
    databaseName: string;
    mapper: MappersTableBase;
}
