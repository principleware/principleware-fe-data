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
    endPointKey?: string;

    securityDelegate: (options: any) => void;
    modelId?: (attributes: any) => any;
    model?: any;

    syncDelegate?: any;

    parseState?: (resp, queryParams, state, options) => any;
    parseRecords?: (resp, options) => any;
    queryParams: IBackboneQueryParams;

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

