import { AntiForgeryKeyPolicy } from './antiforgerykey-policy';

describe('oauth token ext basic', () => {

    const p = new AntiForgeryKeyPolicy({
        url: 'test',
        antiForgeryKey: 'xx',
        elementTag: 'yy'
    });

    it('ctor', () => {

        expect(p).toBeDefined();

    });

});
