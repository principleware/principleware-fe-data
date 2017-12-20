import { IRelationalDatabase, RelationDatabase } from './database';

describe('database basic', () => {

    const db = new RelationDatabase();

    it('add product table', () => {
        db.addTable({
            name: 'product'
        });

        expect(db.getTable('product')).toBeDefined();
    });

    it('add offer table', () => {
        db.addTable({
            name: 'offer'
        });

        expect(db.getTable('offer')).toBeDefined();
    });

    it('addForeignKey', () => {

        expect(() => {
            db.addForeignkey('offer', 'productId', 'product');
        }).not.toThrowError();
    });

    it('addForeignKey throw', () => {

        expect(() => {
            db.addForeignkey('wrong', 'productId', 'product');
        }).toThrowError();
    });


});


describe('databse usecase', () => {
    const db = new RelationDatabase();
    const product = db.addTable({
        name: 'product'
    });
    const offer = db.addTable({
        name: 'offer'
    });

    db.addForeignkey('offer', 'productId', 'product');

    const p1 = {
        id: 'p1'
    };

    const o1 = {
        id: 'o1',
        productId: 'p1'
    };


    const oP1 = product.add(p1);

    const oM1 = offer.add(o1);

    it('The foreign model of offer defined by productId is just product', () => {
        expect(oM1.getForeignModel('productId')).toEqual(oP1);
    });

    it('Product has no more reference after destroying offer', () => {
        oM1.destroyFromTable();

        expect(offer.get('o1')).toBeUndefined();
        expect(oP1.hasAnyReference()).toBeFalsy();
    });

    it('Product has no more reference after destroying offer', () => {
        oP1.destroyFromTable();

        expect(product.get('p1')).toBeUndefined();
    });


});
