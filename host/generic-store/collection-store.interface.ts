import { Observable } from 'rxjs/Observable';

import { ICollectionState, ICollectionItem } from './collection-action-def';

export interface ICollectionStore<T extends ICollectionItem> {

    getState(): Observable<ICollectionState<T>>;

    add(payload: Array<T>): void;

    remove(payload: Array<T>): void;

    modify(payload: Array<T>): void;
}
