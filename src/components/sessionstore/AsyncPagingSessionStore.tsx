import React, { useContext } from "react";
import {IAsyncPagingProps, AsyncPaging} from "../AsyncPaging";
import { PagingSessionStoreContext, IPagingSessionStoreEntry } from "./PagingSessionStore";

export type IAsyncPagingSessionStoreProps<T> =  {
    entryId: any;
} & IAsyncPagingProps<T>;

export const AsyncPagingSessionStore = <T extends any>(props: IAsyncPagingSessionStoreProps<T>) => {
    const { pageSize } = props;
    const sessionStoreContext = useContext(PagingSessionStoreContext);
    const entry = sessionStoreContext.entries.find((e: IPagingSessionStoreEntry) => e.key === props.entryId);

    const onPageChanged = (pageNumber: number) => {
        sessionStoreContext.setEntry({
            pageNumber,
            key: props.entryId,
            pageSize: pageSize,
            context: {
                pKey: props.pkey,
            }
        });
        props.onPageChanged && props.onPageChanged(pageNumber);
    }

    const onReset = () => {
        sessionStoreContext.removeEntry(props.entryId)
    };

    const getInitialPage = () => {
        return entry ? entry.pageNumber : 0;
    }

    return (
        <AsyncPaging 
            {...props}
            onPageChanged={onPageChanged}
            __onReset={onReset}
            __getInitialPage={getInitialPage}
        />
    );
};