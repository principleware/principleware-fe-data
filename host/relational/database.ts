/**
 * @fileOverview
 * Defines a relational database which supports foreign keys and primary keys.
 * Also this database support cascading deletion and addition.
 */

import * as dependencies from '@polpware/fe-dependencies';

import { IRelationalTableOptions, IRelationalTable, RelationalTable } from './table';
import { DummyRecords } from './dummy-records';

export interface IRelationalDatabase {
    getReference(): IRelationalDatabase;
    addTable(options: IRelationalTableOptions): IRelationalTable;
    getTable(name: string): IRelationalTable;
    addForeignkey(name: string, foreignKey: string, foreignName: string): void;
    destroy(): void;
}

export class RelationDatabase implements IRelationalDatabase {

    private _tableCollection: { [key: string]: IRelationalTable };
    private _referenceCounter: number;
    private _dummyRecords: DummyRecords;

    /**
     * Represents a relational database.
     */
    constructor() {
        this._referenceCounter = 1;
        this._tableCollection = {};
        this._dummyRecords = new DummyRecords();
    }

    /**
     * Gets a reference of the file system database
     */
    getReference(): IRelationalDatabase {
        this._referenceCounter++;
        return this;
    }

    /**
     * Defines a table in the database.
     * @function addTable
     * @param {Object} settings
     */
    addTable(options: IRelationalTableOptions): IRelationalTable {
        return this._tableCollection[options.name] = new RelationalTable(options, this._dummyRecords);
    }

    /**
     * Retrieves a table by name.
     */
    getTable(name: string): IRelationalTable {
        return this._tableCollection[name];
    }

    /**
     * Defines a foreign relation between two tables.
     */
    addForeignkey(name: string, foreignKey: string, foreignName: string): void {
        // Constraints
        const table = this._tableCollection[name];
        if (!table) {
            throw new Error('Undefined table: ' + name);
        }

        const foreignTable = this._tableCollection[foreignName];
        if (!foreignTable) {
            throw new Error('Undefined foreign table: ' + foreignName);
        }

        table.addForeignRelation(foreignKey, foreignTable);
        foreignTable.addReverseForeignRelation(foreignKey, table);
    }

    /**
     * Destroys database
     */
    destroy(): void {
        this._referenceCounter--;
        if (this._referenceCounter === 0) {
            for (const k in this._tableCollection) {
                if (this._tableCollection.hasOwnProperty(k)) {
                    const table = this._tableCollection[k];
                    table.destroy();
                }
            }
            this._tableCollection = {};
        }
    }
}
