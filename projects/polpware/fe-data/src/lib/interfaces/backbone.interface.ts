export interface IModelLike {
    id: any;
    attributes: any;
    destroyFromTable(): void;
    getForeignModel(foreignKey: string): IModelLike;
    hasAnyReference(): boolean;
}

export interface IFullModelLike extends IModelLike {
    set(...args: any[]);
    trigger(evt: string, data: any);
}

export interface IBackboneCollectionLike {
    state: IBackboneQueryParams;

    hasNextPage(): boolean;

    getFirstPage(): PromiseLike<any>;

    getNextPage(): PromiseLike<any>;

    forEach(f: (elem: any) => any): any;
}

export interface IFullBackboneCollectionLike extends IBackboneCollectionLike {

    models: [IFullModelLike];

    get(id: any): IFullModelLike;
    findWhere(filter: { [key: string]: any }): IFullModelLike;
    where(filter: { [key: string]: any }): [IFullModelLike];

    add(m: any): IFullModelLike;
    remove(m: IModelLike): IFullModelLike;

    modelId(m: object): any;
    reset(): void;

    on(evt: string, callback: any);
    off(evt: string, callback: any);
    once(evt: string, callback: any);
}

export interface IBackboneQueryParams {
    currentPage?: any;
    pageSize?: any;
    totalPages?: any;
    totalRecords?: any;
    sortKey?: any;
    order?: any;
    directions?: any;
}
