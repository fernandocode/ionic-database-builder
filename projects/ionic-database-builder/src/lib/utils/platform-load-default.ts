import { PlatformLoad } from './platform-load';
import { Injectable } from "@angular/core";

@Injectable()
export class PlatformLoadDefault extends PlatformLoad {
    public ready(): Promise<void> {
        return Promise.resolve();
    }
}