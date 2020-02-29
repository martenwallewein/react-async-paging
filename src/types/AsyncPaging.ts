export enum IFetchState {
    RENDERING = 0,
    RENDERED = 1,
    LOADING = 2,
    READY = 3,
    LOADED = 4,
}

export interface IAsyncPagingMetaInfo {
    currentPage: number;
    pageCount: number;
    pages: number[];
    fetchState: IFetchState;
}

export interface IAsyncPagingNavigationFuncs {
    goto: (pageNumber: number) => Promise<void>;
    back: () => Promise<void>;
    next: () => Promise<void>;
    first: () => Promise<void>;
    last: () => Promise<void>;
}

export type IAsyncPagingItemStore<T> = {[p: number]: T[]};

export type IAsyncPagingChildFunc<T> = (items: T[], meta: IAsyncPagingMetaInfo, nav: IAsyncPagingNavigationFuncs) => any; // FIXME Types