/**
 * @fileOverview
 * Defines a table in a relational database.
 * This table is observable, i.e., any change on this table will be notified to its listeners.
 */

import * as dependencies from '@polpware/fe-dependencies';
import { pushArray } from '@polpware/fe-utilities';
import {
    IModelLike,
    IBackboneCollectionLike,
    IFullBackboneCollectionLike,
    IFullModelLike
} from '../interfaces/backbone.interface';
import { DummyRecords } from './dummy-records';

const backbone = dependencies.backbone;
const _ = dependencies.underscore;
const cjs = dependencies.constraintjs;

export interface IRelationalTableOptions {
    name: string;
    cascade?: boolean;
    dataProviderCtor?: any;
    dataProviderCtorOption?: any;
}

export interface IRelationalTable {
    name: string;
    cascade: boolean;
    dataProvider(): IFullBackboneCollectionLike;
    get(id: any): IFullModelLike;
    add(model: object): IFullModelLike;
    addMany(models: any[]): IFullModelLike[];
    addForeignRelation(foreignKey: string, foreignTable: IRelationalTable): void;
    addReverseForeignRelation(reverseForeignKey: string, table: IRelationalTable): void;
    hasForeignRelation(foreignKey: string): boolean;
    hasReverseForeignRelation(reverseForeignKey: string): boolean;
    destroy(): void;
}

export class RelationalTable implements IRelationalTable {

    private _name: string;
    private _cascade: boolean;
    private _addConstraint: any;
    private _deleteConstraint: any;
    private _foreignRelation: { [key: string]: IRelationalTable };
    private _reverseForeignRelation: { [key: string]: IRelationalTable[] };

    private _dataProvider: IFullBackboneCollectionLike;
    private _onDeletedHandler: any;

    constructor(options: IRelationalTableOptions,
        public dummyRecords: DummyRecords) {

        this._name = options.name;
        this._cascade = false;

        this._foreignRelation = {};
        this._reverseForeignRelation = {};


        if (options.dataProviderCtor) {
            this._dataProvider = new options.dataProviderCtor();
        } else {
            const ctor = backbone.Collection.extend(options.dataProviderCtorOption || {});
            this._dataProvider = new ctor();
        }

        this._addConstraint = cjs.constraint([]);
        this._deleteConstraint = cjs.constraint([]);

        // Todo: Figure out parameters
        this._onDeletedHandler = (...args: any[]) => {
            this.onDeleted();
        };

        // Set up constraint
        this._deleteConstraint.onChange(this._onDeletedHandler);
    }

    public get name(): string {
        return this._name;
    }

    public get cascade(): boolean {
        return this._cascade;
    }

    public dataProvider(): IFullBackboneCollectionLike {
        return this._dataProvider;
    }

    // TODO: Figure out ...
    public onDeleted() {
    }

    /**
     * Check if the given items are still in use.
     */
    private hasAnyReference(item: IModelLike): boolean {
        // Check if this item is in this table or not
        const itemInTable = this._dataProvider.get(item.id);
        if (!itemInTable) {
            return false;
        }

        const revRelations = this._reverseForeignRelation;
        let hasFound = false;
        for (const revK in revRelations) {
            if (revRelations.hasOwnProperty(revK)) {
                const revTables = revRelations[revK];
                hasFound = _.some(revTables, (fromTable) => {
                    const fromTableDataProvider = fromTable.dataProvider();
                    const filter = {};
                    filter[revK] = item.id;
                    const anyUse = fromTableDataProvider.findWhere(filter);
                    return !!anyUse;
                });
                if (hasFound) {
                    break;
                }
            }
        }

        return hasFound;
    }

    /**
     * Removing any items in other tables which depend on the deleted item.
     */
    private removeReverseForeign(removedItems: IModelLike[]): void {
        const revRelation = this._reverseForeignRelation;
        for (const revK in revRelation) {
            if (revRelation.hasOwnProperty(revK)) {
                const revTables = revRelation[revK];
                revTables.forEach((reverseTable) => {
                    const dataProvider = reverseTable.dataProvider();
                    const toBeRemoved = [];
                    removedItems.forEach((item) => {
                        const filter = {};
                        filter[revK] = item.id;
                        const anyItems = dataProvider.where(filter);
                        pushArray(toBeRemoved, anyItems);
                    });
                    toBeRemoved.forEach((item) => {
                        item.destroyFromTable();
                    });
                });
            }
        }
    }

    /**
     * Gets the model in the table by id.
     */
    get(id: any): IFullModelLike {
        return this._dataProvider.get(id);
    }

    private destroyFromTable(thatItem: IModelLike): void {
        const removedItem = this._dataProvider.remove(thatItem);
        if (!removedItem) {
            return;
        }
        // Notify of its collection
        removedItem.set('invalidated', true);
        removedItem.trigger('destroy', removedItem);

        this.removeReverseForeign([removedItem]);
    }

    private getForeignModel(thatItem: IModelLike, foreignKey: string): IModelLike {
        const value = thatItem.attributes[foreignKey];

        // If we do not have this foreignKey, then return a dummy one
        if (!value) {
            return this.dummyRecords.getDummyRecord(foreignKey);
        }

        const table = this._foreignRelation[foreignKey];
        return table.dataProvider().get(value);
    }

    /**
     * Adds an item in the Table and recursively add foreign items.
     */
    add(model: object): IFullModelLike {

        const selfContext = this;

        const dataProvider = this._dataProvider;
        const foreignRelation = this._foreignRelation;

        // Check if the item to be added is already in this table.
        const modelId = dataProvider.modelId(model);
        let addedItem = dataProvider.get(modelId);

        if (addedItem) {
            const newAttr = _.extend({}, addedItem.attributes, model);
            addedItem.set(newAttr);
            return addedItem;
        }

        // Otherwise a new item
        addedItem = dataProvider.add(model);

        // Add convenient methods
        addedItem.destroyFromTable = function() {
            const thatItem = this;
            selfContext.destroyFromTable(thatItem);
        };

        addedItem.getForeignModel = function(foreignKey: string): IModelLike {
            const thatItem = this;
            return selfContext.getForeignModel(thatItem, foreignKey);
        };

        addedItem.hasAnyReference = function(): boolean {
            const thatItem = this;
            return selfContext.hasAnyReference(thatItem);
        };

        return addedItem;
    }

    /**
     * Add many items into a table.
     */
    addMany(models: any[]): IFullModelLike[] {
        return models.map(model => {
            return this.add(model);
        });
    }

    /**
     * Adds a foreign relation.
     */
    addForeignRelation(foreignKey: string, foreignTable: IRelationalTable): void {
        if (this._foreignRelation[foreignKey]) {
            throw new Error('Foreign key exists: ' + foreignKey);
        }
        this._foreignRelation[foreignKey] = foreignTable;
    }

    /**
     * Add a reverse foreign relation.
     */
    addReverseForeignRelation(reverseForeignKey: string, table: IRelationalTable): void {
        const reverseTables = this._reverseForeignRelation[reverseForeignKey];
        if (reverseTables) {
            const index = reverseTables.findIndex((elem) => {
                return elem === table;
            });

            if (index !== -1) {
                throw new Error('Reverse foreign table exists: ' + reverseForeignKey);
            }

            reverseTables.push(table);
        } else {
            this._reverseForeignRelation[reverseForeignKey] = [table];
        }
    }

    /**
     * Check if a given foreign relation is present.
     */
    hasForeignRelation(foreignKey: string): boolean {
        return !!this._foreignRelation[foreignKey];
    }

    /**
     * Checks if a given reverse foreign relation is present.
     */
    hasReverseForeignRelation(reverseForeignKey: string): boolean {
        return !!this._reverseForeignRelation[reverseForeignKey];
    }

    /**
     * Destroys table
     */
    destroy(): void {
        // Remove constraint
        this._deleteConstraint.offChange(this._onDeletedHandler);
        this._dataProvider.reset();
    }
}

