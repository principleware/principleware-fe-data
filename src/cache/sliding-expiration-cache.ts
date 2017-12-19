import * as dependencies from 'principleware-fe-dependencies';

import { MemoryBackend } from './memory-backend';
import { observableDecorator } from '../decorators/observable.decorator';

import { IEventArgs, IObservable } from '../decorators/interfaces';

const locache = dependencies.locache;
const meld = dependencies.meld;

const originalRemove = Object.getPrototypeOf(locache).remove;

const currentTime = function() {
    return new Date().getTime();
}

interface IJoinpoint {
    // Context (i.e. this) of the original method call
    target: any,

    // Array of arguments passed to the original method call
    args: any[],

    // Name of the original method
    method: string,

    // When, called, causes the original method to be invoked
    // When called without arguments, the original arguments will
    // be passed.
    // When called with arguments, they will be passed
    // *instead of* the original arguments
    proceed: (...[any]) => any,

    // Similar to proceed, but accepts an Array of new
    // arguments, (like Function.apply)
    proceedApply: (...[any]) => any,

    // Returns the number of times proceed and/or proceedApply
    // have been called
    proceedCount: (...[any]) => any
}

@observableDecorator
export class SlidingExpirationCache<T> {

    private _cache: any;
    private _timeInterval: any;

    constructor(private _defaultSeconds: number,
        scheduleInterval?: number) {

        const backend = new MemoryBackend();
        this._cache = locache.createCache({ storage: backend });

        this._cache.remove = originalRemove;

        meld.around('remove', (input: IJoinpoint) => {

            const key = input.args[0];
            const name = this.eventName(key);
            const event = this.asObservable.fire(name);

            // if the event is stopped, then stop doing it
            // more time is required ...
            if (event.isDefaultPrevented()) {
                this.resetExpireKey(key, this._defaultSeconds);
                return;
            }

            // Otherwise, continue the original logic
            // Remove all 
            this.asObservable.off(name, null);
            input.proceed();
        });

        // interval
        if (scheduleInterval) {
            this._timeInterval = setInterval(() => {
                this._cache.cleanup();
            }, scheduleInterval);
        } else {
            this._timeInterval = null;
        }
    }

    private eventName(key: string): string {
        return 'expire:' + key;
    }

    private resetExpireKey(key: string, seconds: number) {
        const expirekey = this._cache.expirekey(key);
        const ms = seconds * 1000;
        this._cache.storage.set(expirekey, currentTime() + ms);
    }

    get asObservable(): IObservable {
        const self: any = this;
        const observable: IObservable = self;
        return observable;
    }

    // Given a key, a value and an optional number of seconds store the value
    // in the storage backend.
    set(key: string, value: T, seconds: number) {

        const expirekey = this._cache.expirekey(key);
        const valueKey = this._cache.key(key);

        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
            const ms = seconds * 1000;
            this._cache.storage.set(expirekey, currentTime() + ms);
        }
        else {
            // Remove the expire key, if no timeout is set
            this._cache.storage.remove(expirekey);
        }

        return this._cache.storage.set(valueKey, value);
    }

    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    get(key: string, seconds?: number) {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            this._cache.remove(key);
            return null;
        }

        const valueKey = this._cache.key(key);
        const value = this._cache.storage.get(valueKey);

        // Slide the expire ke
        if (value) {
            this.resetExpireKey(key, seconds || this._defaultSeconds);
        }

        // If value isn't truthy, it must be an empty string or similar, so
        // just return that.
        return value;
    }

    removeExpireHandler(key: string, callback: (evt: IEventArgs) => IEventArgs): void {
        this.asObservable.off(this.eventName(key), callback);
    }

    addExpireHandler(key: string, callback: (evt: IEventArgs) => IEventArgs): void {
        this.asObservable.on(this.eventName(key), callback);
    }

    destroy() {
        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    }
}
