import { DatabaseObject, GetMapper } from 'database-builder';

import { Injector, Injectable } from '@angular/core';
import { TableMapper } from '../mapper/table-mapper';
import { DatabaseSettingsFactoryContract } from 'projects/ionic-database-builder/src/lib';
import { ConfigDatabase } from 'database-builder/src/crud/config-database';

@Injectable()
export class DatabaseSettingsFactory extends DatabaseSettingsFactoryContract {

    databaseName(injector: Injector): string {
        return `database_123`;
    }

    version(injector: Injector): number {
        return 1.0;
    }

    mapper(injector: Injector): GetMapper {
        return injector.get(TableMapper);
    }

    public config(injector: Injector, database: DatabaseObject): Promise<ConfigDatabase> {
        return Promise.resolve({
            sqliteLimitVariables: 999
        });
    }

}