import { UserCredential } from './user-credential'

describe('user credential basic', () => {

    let credential: UserCredential = new UserCredential();

    it('readFrom', () => {
        credential.readFrom({
            username: 'hello'
        });

        expect(credential.getUser().username).toBe('hello');
    });

    it('setUser', () => {
        credential.setUser({
            username: 'world'
        });

        expect(credential.getUser().username).toBe('world');

    });

    it('extendUser', () => {
        credential.extendUser({
            dispayName: 'pp'
        });

        expect(credential.getUser().dispayName).toBe('pp');

    });

    it('isUserKnow', () => {
        expect(credential.isUserKnown()).toBeTruthy();
    });

    it('isAuthenticated', () => {
        expect(credential.isAuthenticated()).toBeFalsy();
    });

});
