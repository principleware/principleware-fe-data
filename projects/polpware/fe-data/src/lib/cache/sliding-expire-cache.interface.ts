import { IEventArgs } from '../interfaces/event-args.interface';

export interface ISlidingExpireCache<T> {

    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    set(key: string, value: T, seconds: number, afterRemoveCallback?: (evt: IEventArgs<{}>) => IEventArgs<{}>);

    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    get(key: string, seconds?: number): T | null;

    rmOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;

    addOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void;

}
