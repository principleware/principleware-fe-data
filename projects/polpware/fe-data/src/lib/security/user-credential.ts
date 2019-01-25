/**
 * @fileOverview
 * Defines the user credential. This user credential supports event
 * listening. Note that the credential is assumed to be Uppercase:
 * Username and Password
 */
import * as dependencies from '@polpware/fe-dependencies';

import {
    isArray
} from '@polpware/fe-utilities';

import { observableDecorator } from '../decorators/observable.decorator';
import { IObservable } from '../interfaces/observable.interface';
import { IEventArgs } from '../interfaces/event-args.interface';

import { IPolicy } from './interfaces';

const _ = dependencies.underscore;

function isEquiva(a: any, b: any): boolean {

    // Strict equals
    if (a === b) {
        return true;
    }

    // Compare null
    if (a === null || b === null) {
        return a === b;
    }

    // Compare number, boolean, string, undefined
    if (typeof a !== 'object' || typeof b !== 'object') {
        return a === b;
    }

    // Compare arrays
    if (isArray(b) && isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }

        let k = a.length;
        while (k--) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }

    const checked = {};
    const objectB = b as Object;
    for (const k in objectB) {
        if (objectB.hasOwnProperty(k)) {
            if (!isEquiva(a[k], b[k])) {
                return false;
            }

            checked[k] = true;
        }
    }

    const objectA = a as Object;
    for (const k in objectA) {
        if (objectA.hasOwnProperty(k)) {
            if (!checked[k] && !isEquiva(a[k], b[k])) {
                return false;
            }
        }
    }

    return true;
}

export interface IUserProfile {
    username?: string;
    email?: string;
    role?: string;
    displayName?: string;
}

// immutable

@observableDecorator
export class UserCredential<T extends IPolicy> {

    private _security: T;
    private _user: IUserProfile;
    /**
     * @constructor Credential
     */
    constructor(public authPolicy: T) {
        this._user = {};
        this._security = authPolicy;
    }

    public get asObservable(): IObservable {
        const self: any = this;
        return self as IObservable;
    }

    public security(value?: T): T {
        if (value) {
            this._security = value;
        }
        return this._security;
    }

    // Does not trigger any event
    readFrom<U extends IUserProfile>(data: U): void {
        this._user = _.extend(this._user, data);
    }

    setUser<U extends IUserProfile>(data: U): void {
        if (isEquiva(this._user, data)) {
            return;
        }

        this._user = data;
        this.asObservable.fire('change:user', {
            data: this._user
        });
    }

    extendUser<U extends IUserProfile>(data: U): void {
        const newData = _.extend({}, this._user, data);
        this.setUser(newData);
    }

    getUser<U extends IUserProfile>(): U {
        return _.extend({}, this._user);
    }

    subscribe<U extends IUserProfile>(handler: (evt: IEventArgs<U>) => IEventArgs<U>, likeBehaviorSubject: boolean = false) {
        this.asObservable.on('change:user', handler);

        if (likeBehaviorSubject) {
            const newEvt: any = { data: this._user };
            handler(newEvt as IEventArgs<U>);
        }
    }

    unSubscribe(handler: (evt: any) => any) {
        this.asObservable.off('change:user', handler);
    }

    isUserKnown(): boolean {
        return !!(this._user && this._user.username);
    }

    isAuthenticated(): boolean {
        return this.authPolicy && !this.authPolicy.isExpired();
    }
}

