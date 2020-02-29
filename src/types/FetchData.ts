export interface IFetchDataResponseMeta {
    itemCount: number;
}

export type IFetchDataResponse<T> = [T[]] | [T[], IFetchDataResponseMeta];
export type IFetchDataFunc<T> = (pageNumber: number, pageSize: number) => Promise<IFetchDataResponse<T>>;

export interface IFetchObjectInput {
    pageNumber: number;
    pageSize: number;
}