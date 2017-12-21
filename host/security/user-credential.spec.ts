import { UserCredential } from './user-credential'

describe('user credential basic', () => {

    let credential: UserCredential = new UserCredential(null);

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


describe('subscribe', () => {

    let credential: UserCredential = new UserCredential(null);

    let getMessage = 0;

    beforeEach((done) => {
        credential.subscribe((evt) => {
            getMessage++;
            done();
            return evt;
        });

        credential.setUser({
            username: 'world'
        });
    });

    it('setUser and get change', (done) => {
        expect(getMessage).toBe(1);

        done();
        credential.setUser({
            username: 'world'
        });

    });

});

describe('set again again', () => {
    var originalTimeout;

    let credential: UserCredential = new UserCredential(null);

    let getMessage = 0;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        credential.subscribe((evt) => {
            getMessage++;
            return evt;
        });

    });

    it('setUser and get change', (done) => {
        credential.setUser({
            username: 'world'
        });

        setTimeout(() => {
            expect(getMessage).toBe(1);
            done();
        }, 2000);
    });

    it('setUser and get no change', (done) => {

        credential.setUser({
            username: 'world'
        });

        setTimeout(() => {
            expect(getMessage).toBe(1);
            done();
        }, 4000);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});



