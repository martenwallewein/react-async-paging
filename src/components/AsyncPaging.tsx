import { useState, useEffect } from 'react';
import { IFetchDataFunc, IFetchDataResponse, IFetchObjectInput } from '../types/FetchData';
import { IAsyncPagingChildFunc, IFetchState, IAsyncPagingItemStore } from '../types/AsyncPaging';
import { times } from '../util/times';

export interface IAsyncPagingProps<T> {
    items?: IAsyncPagingItemStore<T>;
    fetchPage: IFetchDataFunc<T>;
    children: IAsyncPagingChildFunc<T>;
    itemCount?: number;
    pageSize: number;
    setItems?: (items:  IAsyncPagingItemStore<T>) => void;
    skipInitialFetch?: boolean;
    key?: any;
}

// Extends required due to https://github.com/Microsoft/TypeScript/issues/4922
export const AsyncPaging = <T extends any>(props: IAsyncPagingProps<T>) => {
    const {
        items,
        fetchPage,
        children,
        itemCount,
        pageSize,
        setItems,
        skipInitialFetch,
        key,
    } = props;

    // Prefer items if passed
    const [paginatedItems, setPaginatedItems] = useState<{[p: number]: T[]}>(items || {});
    const [itemsToDisplay, setItemsToDisplay] = useState<T[]>([]);

    const [fetchState, setFetchState] = useState<IFetchState>(IFetchState.RENDERING);
    // Here we store the next page to be displayed, but we load it after state changed 
    const [nextPage, setNextPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [internalItemCount, setInternalItemCount] = useState<number>(itemCount || 0);
    const [pages, setPages] = useState<number[]>([]);

    const updateDisplayItems = (pageNumber: number) => {
        const itemsToUse = items || paginatedItems;
        setItemsToDisplay(itemsToUse[pageNumber]);
    }

    const fetchPageImpl = async (pageNumber: number) => {
        setFetchState(IFetchState.LOADING);
        setNextPage(pageNumber);

        const itemsToUse = items || paginatedItems;
        // Check if fetch request can be cached
        if (itemsToUse[pageNumber]) {
            // Finished fetch, data locally available
            setFetchState(IFetchState.LOADED);
            return;
        }

        const fetchRes = await fetchPage(pageNumber, pageSize);
        handleFetchedPage({
            pageNumber,
            pageSize,
        }, fetchRes);
    }

    const handleFetchedPage = (
        fetchRequest: IFetchObjectInput,
        fetchResult: IFetchDataResponse<T>
        ) => {
            const itemsToUse = {...(items || paginatedItems)};
            itemsToUse[fetchRequest.pageNumber] = fetchResult[0];
            // Update itemCount if required (comes from api call)
            if(fetchResult[1]) {
                setInternalItemCount(fetchResult[1].itemCount);
            }
            
            // External items used
            if (setItems) {
                setItems(itemsToUse);
            } else { // Internal items used
                setPaginatedItems(itemsToUse);
            }
            
            setFetchState(IFetchState.LOADED);
    };

    // Reset everything if page size or key changed
    useEffect(() => {
       if(items && setItems) {
            const shouldBeReset = Object.keys(items).length > 0;
            if (shouldBeReset) {
                setItems({});
            }
       } else {
        const shouldBeReset = Object.keys(paginatedItems).length > 0;
        if (shouldBeReset) {
            setPaginatedItems({});
        }
       }
       setCurrentPage(0);
    }, [pageSize, key]);

    // Keep pages up to date, infer pagecount from pages
    useEffect(() => {
        if (internalItemCount && pageSize && pageSize >= 0) {
            const newPageCount = Math.ceil(internalItemCount / pageSize);
            setPages(times(newPageCount));
        }
    }, [internalItemCount, pageSize]);

    // Check if we have to update children if page changed
    useEffect(() => {
        
        // External state used and currently fetching complete, then update page
        if (items && fetchState === IFetchState.LOADED) {
            setFetchState(IFetchState.READY);
            setCurrentPage(nextPage);
            updateDisplayItems(nextPage);
        }
        
        // Local items used and fetching complete, then update page
        if (fetchState === IFetchState.LOADED) {
            setFetchState(IFetchState.READY);
            setCurrentPage(nextPage);
            updateDisplayItems(nextPage);
        }
    }, [items, paginatedItems, fetchState]);

    useEffect(() => {
        if (itemCount && itemCount > 0) {
            setInternalItemCount(itemCount);
        }
    }, [itemCount]);

    // Initial render finished, load first page?
    useEffect(() => {
        if(!items) {
            const shouldBeReset = Object.keys(paginatedItems).length === 0;
        
            if (shouldBeReset && !skipInitialFetch) {
                fetchPageImpl(0);
            } else {
                // setFetchState(IFetchState.READY);
            }
        }
    }, [paginatedItems]);

    // Initial render finished, load first page?
    useEffect(() => {
        if(items) {
            const shouldBeReset = Object.keys(items).length === 0;
        
            if (shouldBeReset && !skipInitialFetch) {
                fetchPageImpl(0);
            } else {
                // setFetchState(IFetchState.READY);
            }
        }
    }, [items]);

    const back = async () => {
        if(currentPage >= 1) {
            fetchPageImpl(currentPage - 1)
        }
    };

    const next = async () => {
        if (currentPage < pages.length - 1) {
            fetchPageImpl(currentPage + 1);
        }
    };

    const goto = async (pageNumber: number) => {
        if (pageNumber >= 0 && pageNumber < pages.length) {
            fetchPageImpl(pageNumber);
        }
    };

    const first = async () => {
        fetchPageImpl(0);
    };

    const last = async () => {
        fetchPageImpl(pages.length >= 0 ? pages.length - 1 : 0)
    };

    return (
        children(itemsToDisplay || [], {
            currentPage,
            fetchState,
            pageCount: pages.length,
            pages,
        }, {
            goto,
            back,
            first,
            last,
            next,
        })
    );
};