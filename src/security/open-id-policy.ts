/**
 * @fileOverview
 * OpenID token policy, built upon OAuth2 token policy
 */

import {
    IOpenIDToken,
    DummyOAuthTokenCtorParams
} from './interfaces';

import { OAuthTokenPolicy, adaptToOAuthToken } from './oauth-token-policy';

export function adaptToOpenIDToken(data): IOpenIDToken {
    data = data || {};

    const r = adaptToOAuthToken(data);
    return { ...r, openId: data.openId || '' };
}

export class OpenIDPolicy extends OAuthTokenPolicy {

    private _openId: string;

    constructor() {
        super(DummyOAuthTokenCtorParams);
        this._openId = '';
    }

    /**
     * Returns the necessary information for peristence.
     */
    persistent(): IOpenIDToken {
        const r = super.persistent();
        return { ...r, openId: this._openId };
    }

    /**
     * Reads credential from the given settings.
     */
    readFrom(settings: IOpenIDToken) {
        super.readFrom(settings);
        this._openId = settings.openId;
        return this;
    }
}
