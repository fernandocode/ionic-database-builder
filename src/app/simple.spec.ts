import { Cidade } from './database/models/cidade';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { TableMapper } from './database/mapper/table-mapper';
import { IonicDatabaseBuilderModule, Database, WebSqlDatabaseService } from 'projects/ionic-database-builder/src/lib';
import { Uf } from './database/models/uf';
import { Regiao } from './database/models/regiao';
import { SubRegiao } from './database/models/sub-regiao';
import { Classificacao } from './database/models/classificacao';
import { Cliente } from './database/models/cliente';
import { PlatformLoadDefault } from 'projects/ionic-database-builder/src/lib/utils/platform-load-default';

describe('Simple Test injector component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        IonicDatabaseBuilderModule.forRoot(
          DatabaseSettingsFactory,
          WebSqlDatabaseService,
          DatabaseMigrationService,
          PlatformLoadDefault,
          false,
          true,
        )
      ],
      providers: [
        TableMapper
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
    const database: Database = TestBed.inject(Database);
    const crud = await database.crud().toPromise();

    await crud.delete(Cliente).execute().toPromise();

    const insert = crud.insert(Cliente, { toSave: clienteToSave });
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

  it('Test transaction mapper insert T', async () => {
    const database: Database = TestBed.inject(Database);
    const crud = await database.crud().toPromise();
    const result = crud.insert(Cliente, { toSave: clienteToSave }).compile();
    expect(result[0].params.toString()).toEqual([
      clienteToSave.codeImport, clienteToSave.razaoSocial, clienteToSave.apelido,
      clienteToSave.desativo, clienteToSave.cidade.codeImport, clienteToSave.classificacao.codeImport
    ].toString());
    expect(result[0].query).toEqual('INSERT INTO Cliente (codeImport, razaoSocial, apelido, desativo, cidade_codeImport, classificacao_codeImport) VALUES (?, ?, ?, ?, ?, ?)');
  });
});
