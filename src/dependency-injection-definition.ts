import { InjectionToken } from "@angular/core";
import { DatabaseCreatorContract } from "database-builder";

export const IS_AVAILABLE_DATABASE = new InjectionToken<boolean>("is_available");
export const IS_ENABLE_LOG = new InjectionToken<boolean>("is_enable_log");
export const DATABASE_CREATOR = new InjectionToken<DatabaseCreatorContract>("database_creator");
