import { SlidingExpirationCache } from './sliding-expiration-cache';

describe('Basic cache', () => {

    const cache = new SlidingExpirationCache<string>(20);

    it('ctor', () => {
        expect(cache).toBeDefined();
    });

    it('set', () => {
        cache.set('name', 'hello', 60);

        expect(cache.get('name')).toEqual('hello');
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

/*
describe('expiring', () => {
    var originalTimeout;
    var myname = 'hello';

    beforeEach(function(done) {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;

        const another = new SlidingExpirationCache<string>(2);
        another.set('name', 'hello', 2);

        setTimeout(function() {
            myname = another.get('name');
            done();
        }, 5 * 1000);
    });

    it('expired', (done) => {
        expect(myname).toBeNull();
        done();
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
*/
