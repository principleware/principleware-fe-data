export interface IRelationDatabaseSchema {
    leafTables: {
        [key: string]: {
            relations?: {
                [key: string]: string
            }
        }
    };

    assocations: {
        [key: string]: {
            relations: {
                [key: string]: string
            }
        }
    };
}
