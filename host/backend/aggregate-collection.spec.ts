import { AggregateCollection } from './aggregate-collection';


describe('aggregate collection basic', () => {

    const dummyGenerator = {
        hasMore: () => { return false },
        getNext: () => {
            const p = new Promise((resolved, rejected) => resolved([]));
            return p as PromiseLike<any>;
        },
        reset: () => {
        }
    };

    let c = new AggregateCollection(dummyGenerator);

    it('ctor', () => {
        expect(c).toBeDefined();
    });
});


