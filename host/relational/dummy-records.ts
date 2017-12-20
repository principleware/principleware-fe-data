/**
 * @fileOverview
 * Defines a global dummy records for tables. Each table is configured with a dummy record.
 */
import * as dependencies from 'principleware-fe-dependencies';

import { IModelLike } from './interfaces';

const backbone = dependencies.backbone;

export class DummyRecords {

    private _data: { [key: string]: IModelLike };

    getDummyRecord(key: string) {
        if (this._data[key]) {
            this._data[key] = new backbone.Model({});
        }
        return this._data[key];
    }
}
