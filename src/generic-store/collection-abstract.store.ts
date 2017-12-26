import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ICollectionState, ICollectionItem } from './collection-action-def';

import { ICollectionStore } from './collection-store.interface';

export abstract class CollectionAbstractStore<T extends ICollectionItem> implements ICollectionStore<T> {

    constructor(private _addedEventName: string,
        private _removedEventName: string,
        private _modifiedEventNamed: string) { }

    public abstract getState(): Store<ICollectionState<T>>;

    public add(payload: Array<T>): void {
        this.getState().dispatch({
            type: 'ADD',
            payload: payload
        });
    }

    public remove(payload: Array<T>): void {
        this.getState().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    }

    public modify(payload: Array<T>): void {
        this.getState().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    }
}
