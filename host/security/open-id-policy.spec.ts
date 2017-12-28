import { OpenIDPolicy, adaptToOpenIDToken } from './open-id-policy';

describe('open id basic', () => {

    const p = new OpenIDPolicy();

    const openId = 'xxxx';

    it('readFrom', () => {
        p.readFrom(adaptToOpenIDToken({ openId: openId }));

        expect(p.persistent().openId).toEqual(openId);
    });

});
