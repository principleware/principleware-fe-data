import { RelationalTable } from './table';
import { DummyRecords } from './dummy-records';


describe('Table basic', () => {
    const table = new RelationalTable({
        name: 'student'
    }, new DummyRecords());

    it('add', () => {

        expect(table.get('tom')).toBeUndefined();

        table.add({
            id: 'tom',
            age: 33
        });

        expect(table.get('tom').attributes.age).toBe(33);
        expect(table.get('tom').getForeignModel).toBeDefined();
        expect(table.get('tom').destroyFromTable).toBeDefined();
        expect(table.get('tom').hasAnyReference).toBeDefined();
    });

    it('addMany', () => {
        table.addMany([{
            id: 'jack',
            age: 38
        }, {
            id: 'lulu',
            age: 22
        }]);

        expect(table.get('lulu').attributes.age).toBe(22);

        const lulu = table.get('lulu');

        expect(lulu).toBeDefined();

        const f = lulu.getForeignModel('any');

        expect(f).toBeDefined();

    });

});


describe('Table destroy', () => {
    const table = new RelationalTable({
        name: 'student'
    }, new DummyRecords());


    table.add({
        id: 'tom',
        age: 33
    });

    it('destrory', () => {

        const tom = table.get('tom');
        tom.destroyFromTable();

        expect(table.get('tom')).toBeUndefined();
    });


});


describe('Table relation', () => {
    const dummyTable = new DummyRecords();

    const product = new RelationalTable({
        name: 'product'
    }, dummyTable);
    const offer = new RelationalTable({
        name: 'offer'
    }, dummyTable);

    const p1 = {
        id: 'p1'
    };

    const offer1 = {
        id: 'offer1',
        productId: 'p1'
    };

    it('addForeignRelation', () => {
        offer.addForeignRelation('productId', product);
        expect(offer.hasForeignRelation('productId')).toBeDefined();

        expect(() => {
            offer.addForeignRelation('productId', product);
        }).toThrowError();

    });

    it('addReverseForeignRelation', () => {
        product.addReverseForeignRelation('productId', offer);
        expect(product.hasReverseForeignRelation('productId')).toBeDefined();

        expect(() => {
            product.addReverseForeignRelation('productId', offer);
        }).toThrowError();

    });

});

