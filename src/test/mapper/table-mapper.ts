import { Injectable } from "@angular/core";
import { DatabaseHelperService, MappersTableSimple } from "../..";
import { TestClazzRef } from "../models/test-clazz-ref";
import { TestClazz } from "../models/test-clazz";
import { Cliente } from "../models/cliente";
import { Cidade } from "../models/cidade";
import { Uf } from "../models/uf";
import { SubRegiao } from "../models/sub-regiao";
import { Regiao } from "../models/regiao";
import { Classificacao } from "../models/classificacao";


@Injectable()
export class TableMapper extends MappersTableSimple {

    constructor(_databaseHelper: DatabaseHelperService) {
        super(
            _databaseHelper,
            {
                references: false,
                referencesId: true,
                referencesIdRecursive: false,
                referencesIdColumn: void 0
            }
        );

        this.mapper(false, void 0, this._defaultSettings,
            TestClazz,
            TestClazzRef,
            Cliente,
            Cidade,
            Uf,
            SubRegiao,
            Regiao,
            Classificacao
        );
    }
}