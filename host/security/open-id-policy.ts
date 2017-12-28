/**
 * @fileOverview
 * OpenID token policy, built upon OAuth2 token policy
 */

import {
    IOpenIDToken
} from './interfaces';

import { OAuthTokenPolicy, adaptToOAuthToken } from './oauth-token-policy';

export function adaptToOpenIDToken(data): IOpenIDToken {
    data = data || {};

    const r = adaptToOAuthToken(data);
    return { ...r, openId: data.openId || '' };
}

export class OpenIDPolicy extends OAuthTokenPolicy {

    protected openId: string;

    constructor() {
        super({
            url: 'dummy',
            clientId: 'dummy',
            clientSecret: 'dummy',
            scope: 'all'
        });
        this.openId = '';
    }

    /**
     * Returns the necessary information for peristence.
     */
    persistent(): IOpenIDToken {
        const r = super.persistent();
        return { ...r, openId: this.openId };
    }

    /**
     * Reads credential from the given settings.
     */
    readFrom(settings: IOpenIDToken) {
        super.readFrom(settings);
        this.openId = settings.openId;
        return this;
    }
}
