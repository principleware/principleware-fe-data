import { DummyOAuthTokenCtorParams } from './interfaces';
import { OAuthTokenExtPolicy, adaptToOAuthToken } from './oauth-token-ext-policy';

describe('oauth token ext basic', () => {

    const p = new OAuthTokenExtPolicy(DummyOAuthTokenCtorParams, {
        name: 'xx'
    });

    it('payload', () => {

        expect(p.payload).toBeDefined();
        expect(p.payload['name']).toBeDefined();
        expect(p.payload['name']).toEqual('xx');
    });

});
