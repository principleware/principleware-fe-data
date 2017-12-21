import { OAuthTokenPolicy, adaptToOAuthToken } from './oauth-token-policy';

describe('oauth basic', () => {

    let policy: OAuthTokenPolicy;

    it('ctor', () => {
        policy = new OAuthTokenPolicy({
            url: 'me',
            clientId: 'me',
            clientSecret: 'xxx',
            scope: 'all'
        });

        expect(policy).toBeDefined();
    });

    it('readFrom', () => {
        policy.readFrom(adaptToOAuthToken({ token: '333' }));

        expect(policy.persistent().token).toEqual('333');
    });

    it('isExpired', () => {
        expect(policy.isExpired()).toBeTruthy();
    });

    it('reset', () => {
        policy.reset();
        expect(policy.persistent().token).toBe('');
    });
});
