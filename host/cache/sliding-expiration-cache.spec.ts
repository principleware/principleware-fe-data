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


describe('long asynchronous specs', function() {
    let originalTimeout;
    let myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);
    another.set('name', 'hello', 2);

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('takes a long time', function(done) {
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
    let originalTimeout;
    let myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);
    another.set('name', 'hello', 2);

    const callback = (evt: IEventArgs<{}>) => {
        evt.preventDefault();
        return evt;
    };

    another.addOnExpireHandler('name', callback);

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('takes a long time', function(done) {
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
    let originalTimeout;
    let myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);
    another.set('name', 'hello', 2);

    const callback = (evt: IEventArgs<{}>) => {
        evt.preventDefault();
        return evt;
    };

    another.addOnExpireHandler('name', callback);

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('takes a long time', function(done) {

        another.rmOnExpireHandler('name', callback);

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


describe('after remove', () => {
    let originalTimeout;
    let myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);

    beforeEach(function(done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        another.set('name', 'hello', 2, function(evt) {
            myname = 'gogo';
            done();
            return evt;
        });

        setTimeout(function() {
            another.get('name');
        }, 3000);

    });

    it('takes a long time', function(done) {
        expect(myname).toEqual('gogo');
        done();
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});


describe('clean and then triggerd after remove', () => {
    let originalTimeout;
    let myname = 'worl';
    const another = new SlidingExpirationCache<string>(2);

    beforeEach(function(done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        another.set('name', 'hello', 2, function(evt) {
            myname = 'gogo';
            done();
            return evt;
        });

        another.reset();
    });

    it('takes a long time', function(done) {
        expect(myname).toEqual('gogo');
        done();
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});



describe('schedule off ', function() {
    let originalTimeout;
    const myname = 'worl';
    let another: SlidingExpirationCache<string>;

    beforeEach(function(done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        another = new SlidingExpirationCache<string>(4);
        another.set('name', 'hello', 4);
        done();
    });

    it('takes a long time', function(done) {
        setTimeout(function() {
            expect(another.count).toBe(1);
            done();
        }, 8000);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});


describe('schedule on ', function() {
    let originalTimeout;
    const myname = 'worl';
    let another: SlidingExpirationCache<string>;

    beforeEach(function(done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        another = new SlidingExpirationCache<string>(4, 2);
        another.set('name', 'hello', 4);
        done();
    });

    it('takes a long time', function(done) {
        setTimeout(function() {
            expect(another.count).toBe(0);
            done();
        }, 8000);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
