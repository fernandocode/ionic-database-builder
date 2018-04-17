import { Classificacao } from "./models/classificacao";
import { SubRegiao } from "./models/sub-regiao";
import { Cidade } from "./models/cidade";
import { Cliente } from "./models/cliente";
import { MappersTableSimple } from "..";
import { DatabaseHelper, Insert } from "database-builder";
import { TestClazz } from "./models/test-clazz";
import { TestClazzRef } from "./models/test-clazz-ref";
import { Uf } from "./models/uf";
import { Regiao } from "./models/regiao";

describe("Mapper", () => {

    const mapper = new MappersTableSimple(new DatabaseHelper(), {
        references: false,
        referencesId: true,
        referencesIdRecursive: false,
        referencesIdColumn: "id"
    })
        .mapper(
            false,
            void 0,
            void 0,
            TestClazz,
            TestClazzRef,
            Cliente,
            Cidade,
            Uf,
            SubRegiao,
            Regiao,
            Classificacao
        );

    const clienteToSave = {
        id: 1,
        razaoSocial: "Razão",
        apelido: "Apelido",
        cidade: {
            id: 2,
            nome: "Cidade",
            uf: {
                id: "SC",
                nome: "Santa Catarina"
            } as Uf,
            subRegiao: {
                id: 4,
                nome: "Sub Região",
                regiao: {
                    id: 5,
                    nome: "Região"
                } as Regiao
            } as SubRegiao,
        } as Cidade,
        classificacao: {
            id: 3,
            descricao: "Top"
        } as Classificacao,
        desativo: false
    } as Cliente;

    it("Test mapper insert", () => {
        const result = new Insert(Cliente, clienteToSave, mapper.getMapper(Cliente)).compile();
        expect(result.params.toString()).toEqual([1, "Razão", "Apelido", false, 2, 3].toString());
        expect(result.query).toEqual("INSERT INTO Cliente (id, razaoSocial, apelido, desativo, cidade_id, classificacao_id) VALUES (?, ?, ?, ?, ?, ?)");
    });

});
