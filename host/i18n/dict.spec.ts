import { I18n } from './dict';

describe('add and translate', () => {

    it('get what we set', () => {
        I18n.add('en', {
            'hello': 'hello world'
        });
        const v = I18n.translate('hello', 'kaka');

        expect(v).toEqual('hello world');
    });

});

describe('recycle others', () => {

    it('remove what we do NOT need', () => {
        I18n.add('cn', {
            'hello': 'china world'
        });

        I18n.recycleOthers('cn');

        const items = I18n.getDictByCode('en');
        expect(items).toBeUndefined();

        const another = I18n.getDictByCode('cn');
        expect(another).toBeDefined();
    });

});
