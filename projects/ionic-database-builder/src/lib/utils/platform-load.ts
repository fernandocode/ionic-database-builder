export abstract class PlatformLoad {
    public abstract ready(): Promise<void>;
}