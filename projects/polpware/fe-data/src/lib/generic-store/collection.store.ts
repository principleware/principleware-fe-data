import { Injectable } from '@angular/core';
import { Store, } from '@ngrx/store';

import { Observable } from 'rxjs';

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

    private _store: Store<GenericState<T>>;

    constructor() {
        super();
        this._store = factory<T>();
    }

    public getStore(): Store<GenericState<T>> {
        return this._store;
    }

    public getState(): Observable<ICollectionState<T>> {
        return this._store.select('collection');
    }
}
