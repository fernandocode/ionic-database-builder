import { TestBed, async } from '@angular/core/testing';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { TableMapper } from './database/mapper/table-mapper';
import { IonicDatabaseBuilderModule, Database, IS_ENABLE_LOG, DATABASE_CREATOR, DatabaseMockService, WebSqlDatabaseService } from 'projects/ionic-database-builder/src/lib';
import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { GuidClazz } from './database/models/guid-clazz';
import { Observable } from 'rxjs';
import { forkJoinSafe } from 'database-builder';

describe('Single Transaction Manager', () => {
    let originalTimeout: number;

    beforeEach(async(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

        const isMock = false;

        TestBed.configureTestingModule({
            imports: [
                IonicDatabaseBuilderModule.forRoot(
                    DatabaseSettingsFactory,
                    WebSqlDatabaseService,
                    DatabaseMigrationService
                )
            ],
            providers: [
                TableMapper,
                { provide: IS_ENABLE_LOG, useValue: false },
                {
                    provide: DATABASE_CREATOR,
                    useFactory: (
                        mock: DatabaseMockService,
                        sqlBrowser: WebSqlDatabaseService
                    ) => {
                        return isMock ? mock : sqlBrowser;
                    },
                    deps: [DatabaseMockService, WebSqlDatabaseService]
                },
                WebSqlDatabaseService,
                DatabaseMockService
            ],
        });
    }));

    afterEach(async(async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const crud = await database.crud().toPromise();
        await crud.delete(GuidClazz).execute().toPromise();

        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    }));

    it('Check execute multiple transaction sequentially', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const crud = await database.crud().toPromise();

        const observers: Array<Observable<boolean>> = [];
        const countTransactions = 1000;

        for (let index = 0; index < countTransactions; index++) {
            const transaction = await database.managedTransaction().toPromise();
            const obj1 = {
                description: `Description $index: ${index}`
            } as GuidClazz;
            transaction.add(
                crud
                    .insert(GuidClazz, { toSave: obj1 })
            );
            observers.push(transaction.commit());
        }
        const result = await forkJoinSafe(observers).toPromise();
        expect(result.length).toEqual(countTransactions);

        const list = await crud.query(GuidClazz).toList().toPromise();
        expect(list.length).toEqual(countTransactions);
        expect(list[0].description).toEqual(`Description $index: 0`);
        expect(list[countTransactions - 1].description).toEqual(`Description $index: ${countTransactions - 1}`);

        const deleteResult = await crud.delete(GuidClazz).execute().toPromise();
        expect(deleteResult.length).toEqual(1);
        expect(deleteResult[0].rowsAffected).toEqual(countTransactions);
    });

});