import { LocalStorageTable } from './localstorage-table';

describe('getP', () => {
    let originalTimeout;

    const table = new LocalStorageTable();

    const key = 'first';
    let value = null;

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        table.getP(key).then((r) => {
            value = r;
            done();
        });

    });

    it('Resolved to be null or undefined', () => {
        expect(value).toEqual({});
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});

describe('updateP', () => {
    let originalTimeout;

    const table = new LocalStorageTable();

    const key = 'second';
    let newValue;
    const oldValue = { m: 'hello' };

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        table.updateP(key, oldValue).then(() => {
            table.getP(key).then((r) => {
                newValue = r;
                done();
            });
        });

    });

    it('Set to be something', () => {
        expect(newValue).toBeDefined();
        expect(newValue.m).toEqual('hello');
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});
