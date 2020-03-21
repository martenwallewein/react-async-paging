import React, { useState, useEffect } from "react";
import {IAsyncPagingProps, AsyncPaging} from "../AsyncPaging";
import { getQueryParams, addQueryArgsToLocation } from '../../util/queryparams';

export const AsyncPagingQueryParams = <T extends any>(props: IAsyncPagingProps<T>) => {
    const { pageSize } = props;
    const [historySearch, setHistorySearch] = useState<string>(window.location.search);
    const queryParams = getQueryParams(historySearch);

    const onPageChanged = (pageNumber: number) => {
        const newQueryArgs = {
            ...queryParams,
            __p: pageNumber,
            __s: pageSize,
        }
        const newLocation = addQueryArgsToLocation("", newQueryArgs)
        history.pushState({}, "", newLocation);
        setHistorySearch(newLocation);

        props.onPageChanged && props.onPageChanged(pageNumber);
    }

    const onReset = () => {
        history.replaceState({}, "", "");
        setHistorySearch("/");
    };

    const isInitialLoad = () => {
        return queryParams?.__p;
    }

    useEffect(() => {

        const onHistoryChange = () => {
            setHistorySearch(window.location.search);
        };
        window.addEventListener('popstate', onHistoryChange);
        return () => window.removeEventListener('popstate', onHistoryChange)
    }, []);

    return (
        <AsyncPaging 
            {...props}
            onPageChanged={onPageChanged}
            __onReset={onReset}
            __getInitialPage={isInitialLoad}
        />
    );
};