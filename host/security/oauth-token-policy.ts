/**
 * @fileOverview
 * Defines a base class for retrieving OAuth2 tokens.
 */

import * as dependencies from '@polpware/fe-dependencies';

import { safeParseInt } from '@polpware/fe-utilities';
import {
    IOAuthTokenPolicyCtorOptions,
    IOAuthToken,
    IOAuthParams
} from './interfaces';
import { PolicyBase } from './policy-base';

const _ = dependencies.underscore;
const $ = dependencies.jquery;

export function adaptToOAuthToken(data): IOAuthToken {
    data = data || {};
    data.expiresIn = data.expiresIn || 0;
    data.createdOn = data.createdOn || 0;
    data.token = data.token || '';
    data.refreshToken = data.refreshToken || '';

    return data;
}

export class OAuthTokenPolicy extends PolicyBase {

    protected clientId: string;
    protected clientSecret: string;
    protected scope: string;
    protected expiresIn: number;
    protected createdOn: number;
    protected refreshToken: string;
    public grantType: 'authorization_code' | 'refresh_token' | 'password' | 'client_credentials';

    constructor(settings: IOAuthTokenPolicyCtorOptions) {
        super(settings);

        this.clientId = settings.clientId;
        this.clientSecret = settings.clientSecret;
        this.scope = settings.scope;
        this.expiresIn = null;
        this.createdOn = null;
        this.refreshToken = '';
    }

    /**
     * Feeds the policy with some settings from outside,
     * usually from local storage
     */
    readFrom(settings: IOAuthToken) {
        this.expiresIn = settings.expiresIn;
        this.createdOn = settings.createdOn;
        this.token = settings.token;
        this.refreshToken = settings.refreshToken;
    }

    /**
     * Returns the data that are persistentable.
     */
    persistent(): IOAuthToken {
        return {
            expiresIn: this.expiresIn,
            createdOn: this.createdOn,
            token: this.token,
            refreshToken: this.refreshToken
        };
    }

    getParams(): any {
        return {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: this.scope,
            grant_type: this.grantType
        };
    }

    // TODO: Support progress loading
    getTokenInternal(): PromiseLike<string> {
        const params = this.getParams();
        return $.ajax({
            url: this.url,
            data: params,
            method: 'POST'
        }).then((resp) => {
            this.createdOn = new Date().getTime();
            this.expiresIn = resp.expires_in;
            this.refreshToken = resp.refreshToken || '';
            return (resp.access_token);
        });
    }

    /**
     * Returns if the token is expired or not.
     */
    isExpired(): boolean {
        if (!this.token || this.token.length < 1) {
            return true;
        }
        if (!this.createdOn) {
            return true;
        }
        const expiresIn = safeParseInt(this.expiresIn);
        if (expiresIn <= 0) {
            return true;
        }
        const now = new Date();
        const diff = now.getTime() - this.createdOn;
        if (diff < expiresIn * 1000) {
            return false;
        }
        return true;
    }

    /**
     * Applys the token to the given options.
     */
    applyTo(options: any): void {
        options.beforeSend = (xhr) => {
            xhr.setRequestHeader('Authorization', ('Bearer '.concat(this.token)));
        };
    }

    /**
     * Apply security policy to the given options.
     */
    applyToV2(options: any): void {
        options.headers = options.headers || {};
        options.headers = {
            Authorization: 'Bearer '.concat(this.token)
        };
    }

    /**
     * App security policy the given options, used for our customized XHR.
     */
    applyToV3(options: any): void {
        options.requestheaders = options.requestheaders || [];
        options.requestheaders.push({
            key: 'Authorization',
            value: 'Bearer '.concat(this.token)
        });
    }

    /**
     * Resets the token and its assoicated information.
     */
    reset() {
        super.reset();
        this.refreshToken = '';
        this.expiresIn = null;
        this.createdOn = null;
    }
}
