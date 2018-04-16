import { Injector } from "@angular/core";
import { MappersTableBase } from "..";
import { DatabaseObject } from "database-builder";

export abstract class DatabaseFactoryContract {

    public abstract database(databaseName: string): Promise<DatabaseObject>;

}
