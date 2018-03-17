import { LocalStorageTable } from './localstorage-table';

describe('getP', () => {
    let originalTimeout;

    const table = new LocalStorageTable();

    const key = 'name';
    let value = null;

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        table.getP(name).then((r) => {
            value = r;
            done();
        });

    });

    it('getP resolved to be null or undefined', () => {
        expect(value).toEqual({});
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});


describe('updateP', () => {
    let originalTimeout;

    const table = new LocalStorageTable();

    const key = 'name';
    let newValue;
    const oldValue = { p: 1 };

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        table.updateP(name, oldValue).then(() => {
            table.getP(name).then((r) => {
                newValue = r;
                done();
            });
        });

    });

    it('updateP set to be something', () => {
        expect(newValue).toEqual(oldValue);
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});
