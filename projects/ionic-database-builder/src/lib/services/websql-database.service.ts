import { Injectable } from '@angular/core';
import { WebSqlDatabaseAdapter } from 'database-builder';

@Injectable()
export class WebSqlDatabaseService extends WebSqlDatabaseAdapter {
    constructor() {
        super((window as any));
    }
}
