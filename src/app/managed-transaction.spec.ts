import { TestBed, async } from '@angular/core/testing';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { TableMapper } from './database/mapper/table-mapper';
import { IonicDatabaseBuilderModule, Database, IS_ENABLE_LOG, DATABASE_CREATOR, DatabaseMockService, WebSqlDatabaseService } from 'projects/ionic-database-builder/src/lib';
import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { GuidClazz } from './database/models/guid-clazz';
import { guidClazz } from './database/data-to-test';
import { DatabaseBuilderError } from 'database-builder';
import { Cidade } from './database/models/cidade';

describe('ManagedTransaction', () => {

    beforeEach(async(() => {
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

    afterEach(async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const crud = await database.crud().toPromise();
        await crud.delete(GuidClazz).execute().toPromise();
    });

    it('Transaction Test', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const crud = await database.crud().toPromise();

        await crud.delete(Cidade).execute().toPromise();

        const cidade: Cidade = new Cidade();
        cidade.nome = 'Cidade Test';
        const insertResult = await crud.insert(Cidade, { toSave: cidade }).execute().toPromise();
        expect(insertResult[0].insertId).toBeGreaterThan(0);
        expect(insertResult[0].rowsAffected).toEqual(1);
    });

    it('Transaction Simple', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const transaction = await database.managedTransaction().toPromise();
        const crud = await database.crud().toPromise();

        const obj1 = Object.assign({}, guidClazz);
        transaction.add(
            crud.insert(GuidClazz, { toSave: obj1 })
        );

        const modelUpdate = {
            guid: 'abc',
            description: 'Teste Update'
        } as GuidClazz;
        transaction.add(
            crud
                .update(GuidClazz, { toSave: modelUpdate })
                .where(where => where.equal(x => x.guid, obj1.guid))
        );

        const modelUpdateByDescription = new GuidClazz(void 0, 'Teste teste test');
        transaction.add(
            crud
                .update(GuidClazz, { toSave: modelUpdateByDescription })
                .where(where => where.equal(x => x.description, modelUpdate.description))
        );

        try {
            const resultTransaction = await transaction.commit().toPromise();
            expect(resultTransaction).toEqual(true);
        } catch (error) {
            console.error(error);
        }

        const queryUpdateResult = await crud.query(GuidClazz).toList().toPromise();
        expect(queryUpdateResult.length).toEqual(1);
        expect(queryUpdateResult[0].description).toEqual(modelUpdateByDescription.description);
        expect(queryUpdateResult[0].guid).toEqual(obj1.guid);
    });

    it('Transaction inactive', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const transaction = await database.managedTransaction().toPromise();
        const crud = await database.crud().toPromise();

        const obj1 = Object.assign({}, guidClazz);
        transaction.add(
            crud
                .insert(GuidClazz, { toSave: obj1 })
        );

        const resultTransaction = await transaction.commit().toPromise();
        expect(resultTransaction).toEqual(true);

        const queryUpdateResult = await crud.query(GuidClazz).toList().toPromise();
        expect(queryUpdateResult.length).toEqual(1);
        expect(queryUpdateResult[0].description).toEqual(obj1.description);
        expect(queryUpdateResult[0].guid).toEqual(obj1.guid);

        expect(() => transaction.add(crud.delete(GuidClazz))).toThrow(new DatabaseBuilderError(`Transaction (id: ${transaction.id}) is no longer active, and can no longer be used`));
    });

    it('Transaction get guid id', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const transaction = await database.managedTransaction().toPromise();
        const crud = await database.crud().toPromise();

        const obj1 = Object.assign({}, guidClazz);

        expect(obj1.guid).toBeUndefined();

        transaction.add(
            crud.insert(GuidClazz, { toSave: obj1 })
        );

        expect(obj1.guid.length).toEqual(36);

        const resultTransaction = await transaction.commit().toPromise();
        expect(resultTransaction).toEqual(true);

        const queryUpdateResult = await crud.query(GuidClazz).firstOrDefault({ where: where => where.equal(x => x.guid, obj1.guid) }).toPromise();
        expect(queryUpdateResult.description).toEqual(obj1.description);
        expect(queryUpdateResult.guid).toEqual(obj1.guid);
    });

    it('Transaction_error', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const transaction = await database.managedTransaction().toPromise();
        const crud = await database.crud().toPromise();

        const obj1 = Object.assign({}, guidClazz);

        transaction.add(
            crud
                .insert(GuidClazz, { toSave: obj1 })
        );
        // script with error, table not exist
        transaction.add(
            crud
                .update(GuidClazz, { toSave: guidClazz })
                .columns(columns => columns.setValue('abc', 1))
        );

        const obj2 = Object.assign({}, guidClazz);

        transaction.add(
            crud
                .insert(GuidClazz, { toSave: obj2 })
        );
        try {
            await transaction.commit().toPromise();
        } catch (error) {
            expect(error.SYNTAX_ERR).toEqual(error.code);
            expect(obj1.guid.length).toEqual(36);

            const queryUpdateResult = await crud.query(GuidClazz).firstOrDefault({ where: where => where.equal(x => x.guid, obj1.guid) }).toPromise();
            expect(queryUpdateResult).toBeUndefined();

            const resultRollback = await transaction.rollback();
            expect(resultRollback).toEqual(true);
            return;
        }
        fail('A transaction era para ter falhado');
    });

    it('Transaction rollback', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const transaction = await database.managedTransaction().toPromise();
        const crud = await database.crud().toPromise();

        const obj1 = Object.assign({}, guidClazz);

        transaction.add(
            crud
                .insert(GuidClazz, { toSave: obj1 })
        );

        const obj2 = Object.assign({}, guidClazz);

        transaction.add(
            crud
                .insert(GuidClazz, { toSave: obj2 })
        );
        const resultRollback = await transaction.rollback();
        expect(resultRollback).toEqual(true);

        const queryUpdateResult2 = await crud.query(GuidClazz).firstOrDefault({ where: where => where.equal(x => x.guid, obj1.guid) }).toPromise();

        expect(queryUpdateResult2).toBeUndefined();
    });

    /**
     * - permitir apenas executar em transaction metodos sem retorno (não permitir adicionar select)
     * Na verdade foi implemtando um tratamento de tipos para o typescript, para apresentar um erro ao tentar adicionar a transaction algo como QueryBuilder
     * Mas em tempo de execução vai executar normalmente, mas não tem nenhuma forma de obter o resultado de uma consulta dentro de uma transaction, então por isso não deve parecer possivel
     * OK
     */
    it('Transaction deny query', async () => {
        const database: Database = TestBed.get(Database);
        expect(database).toBeTruthy();

        const transaction = await database.managedTransaction().toPromise();
        const crud = await database.crud().toPromise();

        const obj1 = Object.assign({}, guidClazz);
        transaction.add(
            crud
                .insert(GuidClazz, { toSave: obj1 })
        );
        transaction.add(
            crud
                .query(GuidClazz) as any
        );

        const modelUpdate = {
            guid: 'abc',
            description: 'Teste Update'
        } as GuidClazz;
        transaction.add(
            crud
                .update(GuidClazz, { toSave: modelUpdate })
                .where(where => where.equal(x => x.guid, obj1.guid))
        );

        const modelUpdateByDescription = new GuidClazz(void 0, 'Teste teste test');
        transaction.add(
            crud
                .update(GuidClazz, { toSave: modelUpdateByDescription })
                .where(where => where.equal(x => x.description, modelUpdate.description))
        );

        const resultTransaction = await transaction.commit().toPromise();
        expect(resultTransaction).toEqual(true);
    });

});