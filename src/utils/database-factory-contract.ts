import { DatabaseObject } from "database-builder";

export abstract class DatabaseFactoryContract {

    public abstract database(databaseName: string): Promise<DatabaseObject>;

}
