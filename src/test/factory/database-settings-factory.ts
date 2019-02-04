import { GetMapper } from 'database-builder';
import { TableMapper } from './../mapper/table-mapper';

import { Injector } from '@angular/core';
import { DatabaseSettingsFactoryContract } from '../../utils/database-settings-factory-contract';

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