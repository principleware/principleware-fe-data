import {
    CollectionActionWithPayload,
    ICollectionState,
    ICollectionItem
} from '../collection-action-def';

export function reducer<T extends ICollectionItem>(
    state: ICollectionState<T>,
    action: CollectionActionWithPayload<T>
): ICollectionState<T> {
    switch (action.type) {

        case 'ADD': {

            const payload = action.payload.filter(x => {
                // Look for it in the current list
                const index = state.items.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });

            return {
                ...state,
                items: [
                    ...state.items,
                    ...payload
                ]
            };
        }

        case 'REMOVE': {

            const newItems = state.items.filter(x => {
                const index = action.payload.findIndex((y) => {
                    return x.id === y.id;
                });
                return index === -1;
            });

            return {
                ...state,
                items: newItems
            };
        }

        case 'MODIFY': {

            // Nothing to do
            return state;
        }

        default:
            return state;

    }
}
