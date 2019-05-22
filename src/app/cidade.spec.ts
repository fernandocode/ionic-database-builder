import { Cidade } from './database/models/cidade';
import { TestBed, async } from '@angular/core/testing';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { TableMapper } from './database/mapper/table-mapper';
import { IonicDatabaseBuilderModule, Database, DatabaseBrowserService, IS_ENABLE_LOG, DATABASE_CREATOR, DatabaseMockService } from 'ionic-database-builder';
import { DatabaseMigrationService } from './database/provider/database-migration-service';

describe('Cidade', () => {
  beforeEach(async(() => {
    const isMock = false;

    TestBed.configureTestingModule({
      imports: [
        IonicDatabaseBuilderModule.forRoot(
          DatabaseSettingsFactory,
          DatabaseBrowserService,
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
            sqlBrowser: DatabaseBrowserService
          ) => {
            return isMock ? mock : sqlBrowser;
          },
          deps: [DatabaseMockService, DatabaseBrowserService]
        },
        DatabaseBrowserService,
        DatabaseMockService
      ],
    });
  }));

  it('insert', async () => {
    const database: Database = TestBed.get(Database);
    expect(database).toBeTruthy();
    const crud = await database.crud().toPromise();

    await crud.delete(Cidade).execute().toPromise();

    const cidade: Cidade = new Cidade();
    cidade.nome = 'Cidade Test';
    const insertResult = await crud.insert(Cidade, cidade).execute().toPromise();
    expect(insertResult[0].insertId).toBeGreaterThan(0);
    expect(insertResult[0].rowsAffected).toEqual(1);
  });

  it('update', async () => {
    const database: Database = TestBed.get(Database);
    expect(database).toBeTruthy();
    const crud = await database.crud().toPromise();

    await crud.delete(Cidade).execute().toPromise();

    const cidade: Cidade = new Cidade();
    cidade.nome = 'Cidade Test';
    const insertResult = await crud.insert(Cidade, cidade).execute().toPromise();
    expect(insertResult[0].insertId).toBeGreaterThan(0);
    expect(insertResult[0].rowsAffected).toEqual(1);

    cidade.nome = 'Nova Cidade';
    const updateResult = await crud.update(Cidade, cidade)
      .where(where => where.equal(x => x.codeImport, cidade.codeImport))
      .execute().toPromise();
    expect(updateResult[0].rowsAffected).toEqual(1);
  });

  it('read', async () => {
    const database: Database = TestBed.get(Database);
    expect(database).toBeTruthy();
    const crud = await database.crud().toPromise();

    await crud.delete(Cidade).execute().toPromise();

    const cidade: Cidade = new Cidade();
    cidade.nome = 'Cidade Test';
    const result = await crud.insert(Cidade, cidade).execute().toPromise();
    expect(result[0].insertId).toBeGreaterThan(0);
    expect(result[0].rowsAffected).toEqual(1);

    cidade.nome = 'Nova Cidade';
    const updateResult = await crud.update(Cidade, cidade)
      .where(where => where.equal(x => x.codeImport, cidade.codeImport))
      .execute().toPromise();
    expect(updateResult[0].rowsAffected).toEqual(1);

    const cidadesRead = await crud.query(Cidade)
      .where(where => where.equal(x => x.codeImport, cidade.codeImport))
      .toList().toPromise();
    expect(cidadesRead.length).toEqual(1);
    expect(cidadesRead[0].codeImport).toEqual(cidade.codeImport);
    expect(cidadesRead[0].nome).toEqual(cidade.nome);
  });
});
