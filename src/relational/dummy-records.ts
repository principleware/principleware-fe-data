/**
 * @fileOverview
 * Defines a global dummy records for tables. Each table is configured with a dummy record.
 */
import * as dependencies from '@polpware/fe-dependencies';

import { IModelLike } from '../interfaces/backbone.interface';

const backbone = dependencies.backbone;

export class DummyRecords {

    private _data: { [key: string]: IModelLike };

    constructor() {
        this._data = {};
    }

    getDummyRecord(key: string) {
        if (!this._data[key]) {
            this._data[key] = new backbone.Model({});
        }
        return this._data[key];
    }
}
