import { Cidade } from './database/models/cidade';
import { TestBed, async } from '@angular/core/testing';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { TableMapper } from './database/mapper/table-mapper';
import { IonicDatabaseBuilderModule, Database, IS_ENABLE_LOG, DATABASE_CREATOR, DatabaseMockService, WebSqlDatabaseService } from 'ionic-database-builder';
import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { ManagedTransaction } from 'database-builder/src/transaction/managed-transaction';

describe('ManagedTransaction', () => {
    beforeAll(async(() => {
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
                { provide: IS_ENABLE_LOG, useValue: true },
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

    it('Transaction Simple', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        database.commitTransaction
        const crud = await database.crud().toPromise();

        await crud.delete(Cidade).execute().toPromise();

        const cidade: Cidade = new Cidade();
        cidade.nome = 'Cidade Test';
        const insertResult = await crud.insert(Cidade, cidade).execute().toPromise();
        expect(insertResult[0].insertId).toBeGreaterThan(0);
        expect(insertResult[0].rowsAffected).toEqual(1);
    });
});