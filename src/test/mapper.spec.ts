import { async, TestBed } from '@angular/core/testing';
import { Classificacao } from './models/classificacao';
import { SubRegiao } from './models/sub-regiao';
import { Cidade } from './models/cidade';
import { Cliente } from './models/cliente';
import { Database, DatabaseModule } from '..';
import { TestClazz } from './models/test-clazz';
import { Uf } from './models/uf';
import { Regiao } from './models/regiao';
import { DatabaseMigrationService } from './provider/database-migration-service';
import { DatabaseSettingsFactory } from './factory/database-settings-factory';
import { TableMapper } from './mapper/table-mapper';
import { DatabaseCreatorFake } from './factory/database-creator-fake';
import { DatabaseBrowserProvider } from './factory/database-browser';

describe('Mapper', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                TableMapper
            ],
            imports: [
                DatabaseModule.forRoot(
                    {
                        useClass: DatabaseSettingsFactory
                    },
                    {
                        useFactory: (mapper: TableMapper) => {
                            return mapper.get(TestClazz) ? true : false;
                        },
                        deps: [TableMapper]
                        // useValue: true
                    },
                    {
                        useClass: DatabaseBrowserProvider
                        // useClass: DatabaseCreatorFake
                        // useClass: SQLite
                    },
                    {
                        useValue: false
                    },
                    DatabaseMigrationService
                )
                // DatabaseModule.forRootValue(
                //     // object to simple settings database
                //     new DatabaseSettingsFactoryDefault(
                //         1, // version database
                //         'database1', // name database
                //         // mapper for database
                //         new MappersTableSimple(new DatabaseHelper(), {
                //             references: false, // if "true" generate column for serialize object reference to JSON.
                //             // Example in "TestClazz", create column "testClazzRef" to serialize "TestClazzRef" object
                //             referencesId: true, // if "true" generate column for id reference.
                //             // Example in "TestClazz", create column "testClazzRef_id" to save "TestClazzRef" property "id"
                //             referencesIdRecursive: false, // if "true" generate column for id reference recursive for all references inner.
                //             referencesIdColumn: 'id' // name id column references
                //         })
                //             .mapper(
                //                 false, // readonly
                //                 void 0, // keyColumn: default "id"
                //                 void 0, // default settings constructor
                //                 // Type models for mapper
                //                 TestClazz,
                //                 TestClazzRef,
                //                 Cliente,
                //                 Cidade,
                //                 Uf,
                //                 SubRegiao,
                //                 Regiao,
                //                 Classificacao
                //             )),
                //     // implementation of "DatabaseMigrationContract" to estrategy migration upgrade versions database
                //     DatabaseMigrationService
                // )
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
        const database: Database = TestBed.get(Database);
        const crud = await database.crud();
        const insert = crud.insert(Cliente, clienteToSave);
        const result = insert.compile();
        expect(result[0].params.toString()).toEqual([
            clienteToSave.codeImport, clienteToSave.razaoSocial, clienteToSave.apelido,
            clienteToSave.desativo, clienteToSave.cidade.codeImport, clienteToSave.classificacao.codeImport
        ].toString());
        expect(result[0].query).toEqual('INSERT INTO Cliente (codeImport, razaoSocial, apelido, desativo, cidade_codeImport, classificacao_codeImport) VALUES (?, ?, ?, ?, ?, ?)');

        const insertResult = await insert.execute();
        console.log(insertResult);

        const queryResultNull = await crud.query(Cliente)
            .where(where => where.isNull(x => x.razaoSocial))
            .toList();

        expect(queryResultNull.length).toEqual(1);
    });

    it('Test transaction mapper insert T', async () => {
        const database: Database = TestBed.get(Database);
        let rollback = () => {
            database.rollbackTransaction().then().catch();
        }
        const crud = await database.beginTransaction()
        try {
            const result = crud.insert(Cliente, clienteToSave).compile();
            expect(result[0].params.toString()).toEqual([
                clienteToSave.codeImport, clienteToSave.razaoSocial, clienteToSave.apelido,
                clienteToSave.desativo, clienteToSave.cidade.codeImport, clienteToSave.classificacao.codeImport
            ].toString());
            expect(result[0].query).toEqual('INSERT INTO Cliente (codeImport, razaoSocial, apelido, desativo, cidade_codeImport, classificacao_codeImport) VALUES (?, ?, ?, ?, ?, ?)');
            const commitResult = await database.commitTransaction()
            expect(commitResult).toEqual(true);
        }
        catch (e) {
            rollback();
        }
    });

});
