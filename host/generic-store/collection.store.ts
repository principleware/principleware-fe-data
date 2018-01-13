import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { factory } from './factory';

import { GenericState } from './reducers/index';
import {
    CollectionAbstractStore
} from './collection-abstract.store';

import {
    ICollectionState,
    ICollectionItem
} from './collection-action-def';


@Injectable()
export class CollectionStore<T extends ICollectionItem>
    extends CollectionAbstractStore<T> {

    private _store: Store<ICollectionState<T>>;

    constructor() {
        super();
        const gstore = factory<T>();
        this._store = gstore.select('collection');
    }

    public getState(): Store<ICollectionState<T>> {
        return this._store;
    }
}
