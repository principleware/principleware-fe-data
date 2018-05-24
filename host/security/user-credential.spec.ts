import { UserCredential } from './user-credential';
import { IUserProfile } from './user-credential';
import { PolicyBase } from './policy-base';

import { IEventArgs } from '../interfaces/event-args.interface';

describe('user credential basic', () => {

    const credential: UserCredential<PolicyBase> = new UserCredential<PolicyBase>(null);

    it('readFrom', () => {
        credential.readFrom({
            username: 'hello'
        });

        expect(credential.getUser<IUserProfile>().username).toBe('hello');
    });

    it('setUser', () => {
        credential.setUser({
            username: 'world'
        });

        expect(credential.getUser<IUserProfile>().username).toBe('world');

    });

    it('extendUser', () => {
        credential.extendUser({
            displayName: 'pp'
        });

        expect(credential.getUser<IUserProfile>().displayName).toBe('pp');

    });

    it('isUserKnow', () => {
        expect(credential.isUserKnown()).toBeTruthy();
    });

    it('isAuthenticated', () => {
        expect(credential.isAuthenticated()).toBeFalsy();
    });

});


describe('subscribe', () => {

    const credential: UserCredential<PolicyBase> = new UserCredential<PolicyBase>(null);

    let getMessage = 0;

    let retEvt: IEventArgs<IUserProfile>;

    beforeEach((done) => {
        credential.subscribe<IUserProfile>((evt) => {
            getMessage++;
            retEvt = evt;
            done();
            return evt;
        });

        credential.setUser<IUserProfile>({
            username: 'world'
        });
    });

    it('setUser and get change', (done) => {
        expect(getMessage).toBe(1);

        expect(retEvt.data).toBeDefined();

        expect(retEvt.data.username).toEqual('world');

        done();
    });

});

describe('set again again', () => {
    let originalTimeout;

    const credential: UserCredential<PolicyBase> = new UserCredential<PolicyBase>(null);

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



