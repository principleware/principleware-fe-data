import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ICollectionState, ICollectionItem } from './collection-action-def';

import { ICollectionStore } from './collection-store.interface';
import { GenericState } from './reducers';

export abstract class CollectionAbstractStore<T extends ICollectionItem> implements ICollectionStore<T> {

    public abstract getState(): Observable<ICollectionState<T>>;
    public abstract getStore(): Store<GenericState<T>>;

    public add(payload: Array<T>): void {
        this.getStore().dispatch({
            type: 'ADD',
            payload: payload
        });
    }

    public remove(payload: Array<T>): void {
        this.getStore().dispatch({
            type: 'REMOVE',
            payload: payload
        });
    }

    public modify(payload: Array<T>): void {
        this.getStore().dispatch({
            type: 'MODIFY',
            payload: payload
        });
    }
}
