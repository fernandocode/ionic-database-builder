import { TableMapper } from './../mapper/table-mapper';

import { Injector } from '@angular/core';
import { DatabaseSettingsFactoryContract, MappersTableBase } from '../..';

export class DatabaseSettingsFactory extends DatabaseSettingsFactoryContract {
    
    databaseName(injector: Injector): string {
        return `database_123`;
    }

    version(injector: Injector): number {
        return 2.0;
    }

    mapper(injector: Injector): MappersTableBase {
        return injector.get(TableMapper);
    }

}