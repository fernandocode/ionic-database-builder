import { Cidade } from './database/models/cidade';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { TableMapper } from './database/mapper/table-mapper';
import { IonicDatabaseBuilderModule, Database, WebSqlDatabaseService } from 'ionic-database-builder';
import { Uf } from './database/models/uf';
import { Regiao } from './database/models/regiao';
import { SubRegiao } from './database/models/sub-regiao';
import { Classificacao } from './database/models/classificacao';
import { Cliente } from './database/models/cliente';
import { PlatformLoadDefault } from 'projects/ionic-database-builder/src/lib/utils/platform-load-default';
import { MigrationFlowService, DatabaseMigrationTestService, MigrationStatus } from './database/provider/database-migration-test-service';

describe('Migration test', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                IonicDatabaseBuilderModule.forRoot(
                    DatabaseSettingsFactory,
                    WebSqlDatabaseService,
                    DatabaseMigrationTestService,
                    PlatformLoadDefault,
                    false,
                    true,
                )
            ],
            providers: [
                TableMapper,
                MigrationFlowService
            ],
        });
    }));

    const clienteToSave = {
        codeImport: 1,
        razaoSocial: void 0,
        apelido: 'Apelido',
        cidade: {
            codeImport: 2,
            nome: 'Cidade',
            uf: {
                codeImport: 'SC',
                nome: 'Santa Catarina'
            } as Uf,
            subRegiao: {
                codeImport: 4,
                nome: 'Sub Região',
                regiao: {
                    codeImport: 5,
                    nome: 'Região'
                } as Regiao
            } as SubRegiao,
        } as Cidade,
        classificacao: {
            codeImport: 3,
            descricao: 'Top'
        } as Classificacao,
        desativo: false
    } as Cliente;

    it('Test mapper insert T', async () => {
        const migrationFlow: MigrationFlowService = TestBed.get(MigrationFlowService);

        let wasStarted: boolean = false;
        migrationFlow.$statusEvent.subscribe((status: MigrationStatus) => {
            if (!wasStarted && status === MigrationStatus.Started) {
                wasStarted = true;
            }
            // console.log(`update status: ${status === MigrationStatus.Started ? 'Started' : 'Finished'}`);
        });

        const database: Database = TestBed.get(Database);

        expect(migrationFlow.status).toBeUndefined();
        const crud = await database.crud().toPromise();
        expect(migrationFlow.status).toEqual(MigrationStatus.Finished);
        expect(wasStarted).toEqual(true);

        await crud.delete(Cliente).execute().toPromise();

        const insert = crud.insert(Cliente, { modelToSave: clienteToSave });
        const result = insert.compile();
        expect(result[0].params.toString()).toEqual([
            clienteToSave.codeImport, clienteToSave.razaoSocial, clienteToSave.apelido,
            clienteToSave.desativo, clienteToSave.cidade.codeImport, clienteToSave.classificacao.codeImport
        ].toString());
        expect(result[0].query).toEqual('INSERT INTO Cliente (codeImport, razaoSocial, apelido, desativo, cidade_codeImport, classificacao_codeImport) VALUES (?, ?, ?, ?, ?, ?)');

        const insertResult = await insert.execute().toPromise();
        expect(insertResult[0].insertId).toBeGreaterThan(0);

        const queryResultNull = await crud.query(Cliente)
            .where(where => where.isNull(x => x.razaoSocial))
            .toList().toPromise();

        expect(queryResultNull.length).toEqual(1);
    });
});
