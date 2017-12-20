export interface IModelLike {
    id: any;
    attributes: any;
    destroyFromTable(): void;
    getForeignModel(foreignKey: string): IModelLike;
}
