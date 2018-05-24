import { OAuthTokenPolicy, adaptToOAuthToken } from './oauth-token-policy';

describe('oauth basic', () => {

    let policy: OAuthTokenPolicy;

    beforeAll(() => {
        policy = new OAuthTokenPolicy({
            url: 'me',
            clientId: 'me',
            clientSecret: 'xxx',
            scope: 'all'
        });
    });

    it('ctor', () => {
        expect(policy).toBeDefined();
    });

    it('readFrom', () => {
        policy.readFrom(adaptToOAuthToken({ token: '333' }));

        expect(policy.persistent().token).toEqual('333');
    });

    it('isExpired', () => {
        expect(policy.isExpired()).toBeTruthy();
    });
});


describe('oauth reset', () => {

    let policy: OAuthTokenPolicy;

    beforeAll(() => {
        policy = new OAuthTokenPolicy({
            url: 'me',
            clientId: 'me',
            clientSecret: 'xxx',
            scope: 'all'
        });
    });

    it('reset', () => {
        policy.reset();
        expect(policy.persistent().token).toBe('');
    });
});
