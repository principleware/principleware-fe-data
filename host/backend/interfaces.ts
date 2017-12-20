export interface IBackboneOptions {
    securityDelegate: (options: any) => void;
    modelId?: (attributes: any) => any;
    model?: any;

    parseState?: (resp, queryParams, state, options) => any;
    parseRecords?: (resp, options) => any;
    queryParams: {
        currentPage?: any,
        pageSize?: any,
        totalPages?: any,
        totalRecords?: any,
        sortKey?: any,
        order?: any,
        directions?: any
    }
}

