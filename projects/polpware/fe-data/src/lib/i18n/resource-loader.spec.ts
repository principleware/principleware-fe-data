import { SlidingExpirationCache } from '../cache/sliding-expiration-cache';
import { ResourceLoader } from './resource-loader';

describe('add and translate', () => {

    const cache = new SlidingExpirationCache<any>(60);
    const loader = new ResourceLoader(cache);

    it('get resource', (done) => {

        loader.register('en-us',
            'https://polpware.github.io/polpware-fe-data/test.json');

        loader.getPromise<string>('en-us.global.alert', x => x.items)
            .then((v) => {
                expect(v).toEqual('Alert');
                done();
            });

    });
});
