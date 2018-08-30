import { Injectable } from "@angular/core";
import { DatabaseHelperService } from "../..";
import { TestClazzRef } from "../models/test-clazz-ref";
import { TestClazz } from "../models/test-clazz";
import { Cliente } from "../models/cliente";
import { Cidade } from "../models/cidade";
import { Uf } from "../models/uf";
import { SubRegiao } from "../models/sub-regiao";
import { Regiao } from "../models/regiao";
import { Classificacao } from "../models/classificacao";
import { MapperBase } from "database-builder";

@Injectable()
export class TableMapper extends MapperBase {

    constructor(_databaseHelper: DatabaseHelperService) {
        super(
            _databaseHelper,
            {
                references: false,
                referencesId: true,
                referencesIdRecursive: false
            }
        );

        this.add(TestClazzRef, x => x.id, true);
        this.add(TestClazz, x => x.id, true);
        this.add(Regiao, x => x.codeImport, true);
        this.add(SubRegiao, x => x.codeImport, true);
        this.add(Uf, x => x.codeImport, true);
        this.add(Cidade, x => x.codeImport, true);
        this.add(Classificacao, x => x.codeImport, true);
        this.add(Cliente, x => x.internalKey, true);
    }
}