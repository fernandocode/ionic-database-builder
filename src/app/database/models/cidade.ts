import { BaseImport } from './base-import';
import { SubRegiao } from "./sub-regiao";
import { Uf } from "./uf";

export class Cidade extends BaseImport<number> {

    public nome: string = "";
    public uf: Uf = new Uf();
    public subRegiao: SubRegiao = new SubRegiao();

    constructor(instance?: Cidade) {
        super(instance ? instance.codeImport : -1);
        if (instance) {
            Object.assign(this, instance);
        }
    }
}
