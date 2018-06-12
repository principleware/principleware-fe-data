import * as ngrxStore from '@ngrx/store';

import { ICollectionItem } from './collection-action-def';

import * as reducerIndex from './reducers/index';

// Store
/*
    ReducerManager,
    StateObservable,
    ActionsSubject
*/

// StateObservable
/*
   ActionsSubject
   ReducerManager
   ScannnedActionsSubject => leaf
   InitialState
*/

// ActionsSubject (leaf)

// ReducerManager
/*
   ReducerManagerDispatcher
   INITIAL_STATE  => pass in parameters
   INITIAL_REDUCERS => ActionReducerMap (pass in parameters)
   REDUCER_FACTORY => combineReducers
   ActionReducerFactory<any, any>
*/

// ReducerManagerDispatcher

/*
   ActionSsubject  (leaf)
*/

// ActionReducerFactory<any, any> (Use combinReducer function from utils)

/*
   ActionReducerMap
   initialState

   ActionReducer
*/

// createReducerfactory
/*
   ActionReducerFactory
   MataReducerFactory

*/

export function factory<T extends ICollectionItem>(): ngrxStore.Store<reducerIndex.GenericState<T>> {

    const actionSubject = new ngrxStore.ActionsSubject();
    const scannerActionSubject = new ngrxStore.ScannedActionsSubject();
    const reducerManagerDispatch: ngrxStore.ReducerManagerDispatcher = actionSubject;

    const actionReducerFactory: ngrxStore.ActionReducerFactory<any, any> = ngrxStore.combineReducers;

    const reducerManager = new ngrxStore.ReducerManager(actionSubject,
        reducerIndex.buildInitialState<T>(),
        reducerIndex.buildReducerMap<T>(),
        actionReducerFactory);

    const stateObservable = new ngrxStore.State(actionSubject,
        reducerManager,
        scannerActionSubject,
        reducerIndex.buildInitialState<T>());

    const store = new ngrxStore.Store<reducerIndex.GenericState<T>>(stateObservable, actionSubject, reducerManager);
    return store;
}
