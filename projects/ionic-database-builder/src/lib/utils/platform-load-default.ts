import { PlatformLoad } from './platform-load';

export class PlatformLoadDefault extends PlatformLoad {
    public ready(): Promise<void> {
        return Promise.resolve();
    }
}