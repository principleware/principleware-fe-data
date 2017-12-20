import { SlidingExpirationCache } from './sliding-expiration-cache';

import { IEventArgs } from '../interfaces/event-args.interface';

describe('Basic cache', () => {

    const cache = new SlidingExpirationCache<string>(20);

    it('ctor', () => {
        expect(cache).toBeDefined();
    });

    it('set', () => {
        cache.set('name', 'hello', 60);

        expect(cache.get('name')).toEqual('hello');
    });

    it('reset', () => {
        cache.reset();

        expect(cache.get('name')).toBeNull();
    });
});


describe("long asynchronous specs", function() {
    var originalTimeout;
    var myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);
    another.set('name', 'hello', 2);

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it("takes a long time", function(done) {
        setTimeout(function() {
            myname = another.get('name');
            expect(myname).toBeNull();
            done();
        }, 3000);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});


describe('stop expiring', () => {
    var originalTimeout;
    var myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);
    another.set('name', 'hello', 2);

    const callback = (evt: IEventArgs) => {
        evt.preventDefault();
        return evt;
    };

    another.addExpireHandler('name', callback);

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it("takes a long time", function(done) {
        setTimeout(function() {
            myname = another.get('name');
            expect(myname).toBe('hello');
            done();
        }, 3000);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});


describe('void event handler', () => {
    var originalTimeout;
    var myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);
    another.set('name', 'hello', 2);

    const callback = (evt: IEventArgs) => {
        evt.preventDefault();
        return evt;
    };

    another.addExpireHandler('name', callback);

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it("takes a long time", function(done) {

        another.removeExpireHandler('name', callback);

        setTimeout(function() {
            myname = another.get('name');
            expect(myname).toBeNull();
            done();
        }, 3000);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});

