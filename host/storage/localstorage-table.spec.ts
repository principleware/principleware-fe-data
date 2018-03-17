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
