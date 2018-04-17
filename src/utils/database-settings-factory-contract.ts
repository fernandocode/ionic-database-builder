import { Injector } from "@angular/core";
import { MappersTableBase } from "..";

export abstract class DatabaseSettingsFactoryContract {

    public abstract databaseName(injector: Injector): string;
    public abstract version(injector: Injector): number;
    public abstract mapper(injector: Injector): MappersTableBase;
}
