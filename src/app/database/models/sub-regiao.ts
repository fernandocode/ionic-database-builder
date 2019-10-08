import { BaseImport } from './base-import';
import { Regiao } from './regiao';

export class SubRegiao extends BaseImport<number> {

    public nome: string = '';
    public regiao: Regiao = new Regiao();

    constructor() {
        super(0);
    }
}
