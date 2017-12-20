export interface IModelLike {
    id: any;
    attributes: any;
    destroyFromTable(): void;
    getForeignModel(foreignKey: string): IModelLike;
    hasAnyReference(): boolean;
}

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
