export interface IBackboneQueryParams {
    currentPage?: any;
    pageSize?: any;
    totalPages?: any;
    totalRecords?: any;
    sortKey?: any;
    order?: any;
    directions?: any;
}

export interface IBackboneOptions {
    securityDelegate: (options: any) => void;
    url: string;
    modelId?: (attributes: any) => any;
    model?: any;

    syncDelegate?: any;
    parse?: any;

    parseState?: (resp, queryParams, state, options) => any;
    parseRecords?: (resp, options) => any;
    queryParams?: IBackboneQueryParams;

    deleteUrl?: string;
    deleteContentType?: string;

    updateUrl?: string;
    updateContentType?: string;

    createUrl?: string;
    createContentType?: string;

    patchUrl?: string;
    patchContentType?: string;

    extraParams?: any;
    contentType?: string;
}

export interface IBackboneWorkingOptions extends IBackboneOptions {
    endPointKey: string;
}

export interface IBackboneConfiguration {
    tag: number;
    options: IBackboneWorkingOptions;
}

export interface IEndpointSpec {
    [key: string]: {
        url: string,
        options?: IBackboneOptions
    }
}


export interface IParserTableSpec {
    [key: string]: {
        parser: string
    }
}

export interface IBackboneCollectionLike {
    state: IBackboneQueryParams;

    hasNextPage(): boolean;

    getFirstPage(): PromiseLike<any>;

    getNextPage(): PromiseLike<any>;

    forEach(f: (elem: any) => any): any;
}
