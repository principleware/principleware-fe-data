import { Action } from '@ngrx/store';

export type CollectionActionTypes = 'ADD' | 'REMOVE' | 'MODIFY';

export interface ICollectionItem {
    id: string | number;
}

export interface CollectionActionWithPayload<T extends ICollectionItem> extends Action {
    payload: Array<T>;
}

export interface ICollectionState<T extends ICollectionItem> {
    items: Array<T>;
}


