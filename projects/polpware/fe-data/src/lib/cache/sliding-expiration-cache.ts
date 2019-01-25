//
// Author:: Tom Tang <polpware@gmail.com>
// Copyright:: Copyright (c) 2017, Xiaolong Tang
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Except as contained in this notice, the name(s) of the above copyright
// holders shall not be used in advertising or otherwise to promote the
// sale, use or other dealings in this Software without prior written
// authorization.

import * as dependencies from '@polpware/fe-dependencies';

import { MemoryBackend } from './memory-backend';
import { observableDecorator } from '../decorators/observable.decorator';

import { IEventArgs } from '../interfaces/event-args.interface';
import { IObservable } from '../interfaces/observable.interface';
import { IJoinpoint } from '../interfaces/joint-point.interface';
import { INgZoneLike } from '../interfaces/ng-zone-like.interface';

import { ISlidingExpireCache } from './sliding-expire-cache.interface';

const locache = dependencies.locache;
const meld = dependencies.meld;

const originalRemove = Object.getPrototypeOf(locache.locache).remove;

const currentTime = function() {
    return new Date().getTime();
};

@observableDecorator
export class SlidingExpirationCache<T> implements ISlidingExpireCache<T> {

    private _cache: any;
    private _timeInterval: any;

    constructor(private _defaultSeconds: number,
        scheduleInterval?: number, ngZone?: INgZoneLike) {

        const backend = new MemoryBackend<T>();
        this._cache = locache.locache.createCache({ storage: backend });

        this._cache.remove = meld.around(originalRemove, (input: IJoinpoint) => {

            const key = input.args[0];
            const onExpireEvtName = this.onExpireEventName(key);
            const event = this.asObservable.fire(onExpireEvtName, {});

            // if the event is stopped, then stop doing it
            // more time is required ...
            if (event.isDefaultPrevented()) {
                this.resetExpireKey(key, this._defaultSeconds);
                return false;
            }

            // Otherwise, continue the original logic
            // Remove all listener
            this.asObservable.off(onExpireEvtName, null);
            input.proceed();

            // fire event
            const afterRemoveEvtName = this.afterRemoveEventName(key);
            this.asObservable.fire(afterRemoveEvtName, {});

            return true;
        });

        // interval
        if (scheduleInterval) {
            if (ngZone) {
                ngZone.runOutsideAngular(() => {
                    this._timeInterval = setInterval(() => {
                        this._cache.cleanup();
                    }, scheduleInterval * 1000);
                });
            }
            else {
                this._timeInterval = setInterval(() => {
                    this._cache.cleanup();
                }, scheduleInterval * 1000);
            }
        } else {
            this._timeInterval = null;
        }
    }

    private onExpireEventName(key: string): string {
        return 'onExpire:' + key;
    }

    private afterRemoveEventName(key: string): string {
        return 'afterRemove:' + key;
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
    set(key: string, value: T, seconds: number, afterRemoveCallback?: (evt: IEventArgs<{}>) => IEventArgs<{}>) {

        const expirekey = this._cache.expirekey(key);
        const valueKey = this._cache.key(key);

        if (seconds) {
            // The time stored is in milliseconds, but this function expects
            // seconds, so multiply by 1000.
            const ms = seconds * 1000;
            this._cache.storage.set(expirekey, currentTime() + ms);
        } else {
            // Remove the expire key, if no timeout is set
            this._cache.storage.remove(expirekey);
        }

        if (afterRemoveCallback) {
            this.asObservable.once(this.afterRemoveEventName(key), afterRemoveCallback);
        }

        return this._cache.storage.set(valueKey, value);
    }

    // Fetch a value from the cache. Either returns the value, or if it
    // doesn't exist (or has expired) return null.
    get(key: string, seconds?: number): T | null {
        // If the value has expired, before returning null remove the key
        // from the storage backend to free up the space.
        if (this._cache.hasExpired(key)) {
            if (this._cache.remove(key)) {
                return null;
            }
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

    rmOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void {
        this.asObservable.off(this.onExpireEventName(key), callback);
    }

    addOnExpireHandler(key: string, callback: (evt: IEventArgs<{}>) => IEventArgs<{}>): void {
        this.asObservable.on(this.onExpireEventName(key), callback);
    }

    public get count(): number {
        return this._cache.length();
    }

    reset() {
        const keys = this._cache.keys();
        keys.forEach((k) => {
            this.asObservable.off(this.onExpireEventName(k), null);
            originalRemove.call(this._cache, k);
            this.asObservable.fire(this.afterRemoveEventName(k), {});
        });
    }

    // must destory, or leaking ...
    destroy() {
        this.reset();

        if (this._timeInterval) {
            clearInterval(this._timeInterval);
        }
    }
}
