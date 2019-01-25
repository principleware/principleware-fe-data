/**
 * @fileOverview
 * A base class for defining security plicies.
 */

import * as dependencies from '@polpware/fe-dependencies';

import { lift } from '@polpware/fe-utilities';

import { IPolicyCtorOptions, IPolicy } from './interfaces';

const _ = dependencies.underscore;

export abstract class PolicyBase implements IPolicy {

    protected url: string;
    protected token: string;

    constructor(settings: IPolicyCtorOptions) {
        this.url = settings.url;
        this.token = '';
    }

    abstract getTokenInternal(): PromiseLike<string>;

    abstract applyTo(options: any): void;

    abstract isExpired(): boolean;

    abstract readFrom(settings: {});

    abstract persistent(): any;

    abstract applyToV2(options: any): void;

    abstract applyToV3(options: any): void;


    /**
     * The interface for retrieving the token from a remote server.
     * This method internally dispatches the call to another method
     * and cache the token.
     */
    getTokenP(): PromiseLike<string> {
        if (!_.isEmpty(this.token) && !this.isExpired()) {
            return lift(this.token, null);
        }

        return this.getTokenInternal()
            .then((token) => {
                return this.token = token;
            });
    }

    /**
     * Reset the security policy, e.g.,
     * removing established token.
     */
    reset() {
        this.token = '';
    }
}
