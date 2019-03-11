import { GetMapper } from 'database-builder';

export interface DatabaseSettingsModel {
    version: number;
    databaseName: string;
    mapper: GetMapper;
}
