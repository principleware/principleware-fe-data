import { factory } from './factory';

describe('ngx store ctor', () => {

    const p = factory();
    it('state is defined', () => expect(p).toBeDefined());

    const q = p.select('collection');
    it('collection is defined', () => expect(q).toBeDefined());
});

describe('ngx store add', () => {

    const p = factory();
    const q = p.select('collection');

    it('add', (done) => {
        const subscribeId = q.subscribe(m => {
            if (m.items.length < 1) {
                return;
            }
            expect(m.items.length).toBe(1);

            subscribeId.unsubscribe();
            done();
        });
        q.dispatch({
            type: 'ADD',
            payload: [{
                name: 'hello',
                id: '111'
            }]
        });

    });

});


describe('ngx store remove', () => {

    const p = factory();
    const q = p.select('collection');

    q.dispatch({
        type: 'ADD',
        payload: [{
            name: 'hello',
            id: '111'
        }]
    });


    it('remove ...', (done) => {
        const subscribeId = q.subscribe(m => {
            if (m.items.length > 0) {
                return;
            }
            expect(m.items.length).toBe(0);

            subscribeId.unsubscribe();
            done();
        });
        q.dispatch({
            type: 'REMOVE',
            payload: [{
                name: 'hello',
                id: '111'
            }]
        });

    });

});


describe('ngx store remove', () => {

    const pp = factory();
    const qq = pp.select('collection');

    const p = factory();
    const q = p.select('collection');

    it('not equal', () => {
        expect(qq === q).toBeFalsy();
    });

    q.dispatch({
        type: 'ADD',
        payload: [{
            name: 'hello',
            id: '111'
        }]
    });


    it('remove ...', (done) => {
        const subscribeId = qq.subscribe(m => {
            expect(m.items.length).toBe(0);
            if (subscribeId) {
                subscribeId.unsubscribe();
            }

            done();
        });

        q.dispatch({
            type: 'ADD',
            payload: [{
                name: 'hello',
                id: '114'
            }]
        });

    });

});


