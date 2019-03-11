import { Component } from '@angular/core';
import { Uf } from './database/models/uf';
import { Regiao } from './database/models/regiao';
import { SubRegiao } from './database/models/sub-regiao';
import { Cidade } from './database/models/cidade';
import { Classificacao } from './database/models/classificacao';
import { Cliente } from './database/models/cliente';
import { Database } from 'ionic-database-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ionic-database-builder-library';

  constructor(
    private database: Database
  ) {
    this.test();
    console.log(this.database)
  }

  test() {
    const clienteToSave = {
      codeImport: 1,
      razaoSocial: 'Razão',
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

    this.database.crud()
      .subscribe(crud => {
        const result = crud.insert(Cliente, clienteToSave).compile();
        // expect(result[0].params.toString()).toEqual([
        //   clienteToSave.codeImport, clienteToSave.razaoSocial, clienteToSave.apelido,
        //   clienteToSave.desativo, clienteToSave.cidade.codeImport, clienteToSave.classificacao.codeImport
        // ].toString());
        // expect(result[0].query).toEqual('INSERT INTO Cliente (codeImport, razaoSocial, apelido, desativo, cidade_codeImport, classificacao_codeImport) VALUES (?, ?, ?, ?, ?, ?)');
      }, err => {
        new Error(err);
      });

    let rollback = () => {
      this.database.rollbackTransaction()
        .subscribe(_ => _,
          err => {
            new Error(err);
          });
    }
    this.database.beginTransaction()
      .subscribe(crud => {
        try {
          const result = crud.insert(Cliente, clienteToSave).compile();
          // expect(result[0].params.toString()).toEqual([
          //   clienteToSave.codeImport, clienteToSave.razaoSocial, clienteToSave.apelido,
          //   clienteToSave.desativo, clienteToSave.cidade.codeImport, clienteToSave.classificacao.codeImport
          // ].toString());
          // expect(result[0].query).toEqual('INSERT INTO Cliente (codeImport, razaoSocial, apelido, desativo, cidade_codeImport, classificacao_codeImport) VALUES (?, ?, ?, ?, ?, ?)');
          this.database.commitTransaction()
            .subscribe(x => {
              // expect(x).toEqual(true);
            }, err => {
              rollback()
            });
        }
        catch (e) {
          rollback();
        }
      }, err => {
        new Error(err);
      });
  }
}
