import React, { useState, useEffect } from 'react';
import { IFetchDataFunc, IFetchDataResponse, IFetchObjectInput } from '../types/FetchData';
import { IAsyncPagingChildFunc, IFetchState } from '../types/AsyncPaging';

export interface IAsyncPagingProps<T> {
    items?: T[];
    fetchPage: IFetchDataFunc<T>;
    children: IAsyncPagingChildFunc<T>;
    itemCount?: number;
    pageSize: number;
    setItems?: (items: T[]) => void;
    skipInitialFetch?: boolean;
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
    } = props;

    // Prefer items if passed
    const [paginatedItems, setPaginatedItems] = useState<T[]>(items || []);
    const [itemsToDisplay, setItemsToDisplay] = useState<T[]>([]);

    const [fetchState, setFetchState] = useState<IFetchState>(IFetchState.RENDERING);
    // Here we store the next page to be displayed, but we load it after state changed 
    const [nextPage, setNextPage] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [internalItemCount, setInternalItemCount] = useState<number>(itemCount || 0);

    const updateDisplayItems = (pageNumber: number) => {
        const itemsToUse = items || paginatedItems;
        setItemsToDisplay(itemsToUse.slice(pageNumber * pageSize, pageSize));
    }

    const fetchPageImpl = async (pageNumber: number) => {
        setFetchState(IFetchState.LOADING);
        setNextPage(pageNumber);

        // Check if fetch request can be cached
        const targetIndex = pageNumber * pageSize;
        const itemsToUse = items || paginatedItems;
        
        if (itemsToUse[targetIndex]) {
            // Finished fetch, data locally available
            setFetchState(IFetchState.LOADED);
            return;
        }

        const fetchRes = await fetchPage(0, pageSize);
        handleFetchedPage({
            pageNumber,
            pageSize,
        }, fetchRes);
    }

    const handleFetchedPage = (
        fetchRequest: IFetchObjectInput,
        fetchResult: IFetchDataResponse<T>
        ) => {
            const itemsToUse = items || paginatedItems;
            const newItems = [...itemsToUse];
            newItems.splice(fetchRequest.pageNumber * fetchRequest.pageSize, 0, ...fetchResult[0]);
            // External items used
            if (setItems) {
                setItems(newItems);
            } else { // Internal items used
                setPaginatedItems(newItems);
            }
    };

    // Check if we have to update children if page changed
    useEffect(() => {
        // External state used and currently fetching complete, then update page
        if (items && items.length > 0 && fetchState === IFetchState.LOADED) {
            setCurrentPage(nextPage);
            updateDisplayItems(nextPage);
        }

        // Local items used and fetching complete, then update page
        if (fetchState === IFetchState.LOADED) {
            setCurrentPage(nextPage);
            updateDisplayItems(nextPage);
        }
    }, [items, paginatedItems, fetchState]);

    useEffect(() => {
        if (itemCount && itemCount > 0) {
            setInternalItemCount(itemCount);
        }
    }, [itemCount])

    // Initial render finished, load first page?
    useEffect(() => {
        if (!skipInitialFetch) {
            fetchPageImpl(0);
        } else {
            setFetchState(IFetchState.READY);
        }
    }, []);

    const back = async () => {

    };

    const next = async () => {

    };

    const goto = async (pageNumber: number) => {

    };

    const first = async () => {

    };

    const last = async () => {

    };

    return (
        children(itemsToDisplay, {
            currentPage,
            fetchState,
            pageCount: 0,
            pages: [],
        }, {
            goto,
            back,
            first,
            last,
            next,
        })
    );
};