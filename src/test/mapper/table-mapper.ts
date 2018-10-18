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
import { PrimaryKeyType } from "database-builder/src/core/enums/primary-key-type";

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

        this.autoMapper(TestClazzRef, x => x.id, PrimaryKeyType.AutoIncrement);
        this.autoMapper(TestClazz, x => x.id, PrimaryKeyType.AutoIncrement);
        this.autoMapper(Regiao, x => x.codeImport, PrimaryKeyType.AutoIncrement);
        this.autoMapper(SubRegiao, x => x.codeImport, PrimaryKeyType.AutoIncrement);
        this.autoMapper(Uf, x => x.codeImport, PrimaryKeyType.AutoIncrement);
        this.autoMapper(Cidade, x => x.codeImport, PrimaryKeyType.AutoIncrement);
        this.autoMapper(Classificacao, x => x.codeImport, PrimaryKeyType.AutoIncrement);
        this.autoMapper(Cliente, x => x.internalKey, PrimaryKeyType.AutoIncrement);
    }
}