import {
    IOAuthTokenPolicyCtorOptions
} from './interfaces';

import { OAuthTokenPolicy } from './oauth-token-policy';
export { adaptToOAuthToken } from './oauth-token-policy';

export class OAuthTokenExtPolicy extends OAuthTokenPolicy {

    private _payload: object;

    constructor(settings: IOAuthTokenPolicyCtorOptions, payload: object) {
        super(settings);

        this._payload = { ...payload };
    }

    public get payload(): object {
        return this._payload;
    }

    // override
    getParams(): any {
        const p = super.getParams();
        return { ...p, ... this._payload };
    }
}
