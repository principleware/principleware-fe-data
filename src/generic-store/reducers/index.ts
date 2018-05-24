import { ActionReducerMap } from '@ngrx/store';
import { combineReducers } from '@ngrx/store';

import { ICollectionState, ICollectionItem } from '../collection-action-def';
import * as fromCollection from './collection.reducer';


export interface GenericState<T extends ICollectionItem> {
    collection: ICollectionState<T>;
}

export function buildInitialState<T extends ICollectionItem>(): GenericState<T> {
    return {
        collection: {
            items: []
        }
    };
}

export function buildReducerMap<T extends ICollectionItem>(): ActionReducerMap<GenericState<T>> {
    return {
        collection: fromCollection.reducer
    };
}


