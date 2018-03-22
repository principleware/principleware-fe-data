import { pingP, loadJsonUriP, loadHtmlP } from './curl';

describe('loadJsonUriP', () => {
    let originalTimeout;

    let value = false;

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        loadJsonUriP('https://principleware.github.io/principleware-fe-data/test.json').then((r) => {
            value = true;
            done();
        }, (error) => {
            console.log(error);
        });

    });

    it('Load package.json', () => {
        expect(value).toBeTruthy();
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});

describe('pingP', () => {
    let originalTimeout;

    let value = false;

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        pingP('https://principleware.github.io/principleware-fe-data/index.html', {}).then((r) => {
            value = true;
            done();
        }, (error) => {
            console.log(error);
        });

    });

    it('Connect to github', () => {
        expect(value).toBeTruthy();
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});


describe('loadHtmlP', () => {
    let originalTimeout;

    let value = false;

    beforeEach((done) => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
        loadHtmlP('https://principleware.github.io/principleware-fe-data/index.html').then((r) => {
            value = true;
            done();
        }, (error) => {
            console.log(error);
        });

    });

    it('Load html from github', () => {
        expect(value).toBeTruthy();
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

});
