export interface IModelLike {
    id: any;
    attributes: any;
    destroyFromTable(): void;
    getForeignModel(foreignKey: string): IModelLike;
    hasAnyReference(): boolean;
}

export interface IBackboneCollectionLike {
    state: IBackboneQueryParams;

    hasNextPage(): boolean;

    getFirstPage(): PromiseLike<any>;

    getNextPage(): PromiseLike<any>;

    forEach(f: (elem: any) => any): any;

    where<T extends IModelLike>(fiters: { [key: string]: any }): Array<T>;
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
