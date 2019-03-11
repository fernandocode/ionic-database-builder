import { GetMapper } from 'database-builder';

import { Injector, Injectable } from '@angular/core';
import { TableMapper } from '../mapper/table-mapper';
import { DatabaseSettingsFactoryContract } from 'ionic-database-builder';

@Injectable({
    providedIn: 'root'
})
export class DatabaseSettingsFactory extends DatabaseSettingsFactoryContract {

    databaseName(injector: Injector): string {
        return `database_123`;
    }

    version(injector: Injector): number {
        return 2.0;
    }

    mapper(injector: Injector): GetMapper {
        return injector.get(TableMapper);
    }

}