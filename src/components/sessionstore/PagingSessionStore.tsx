import React from "react";
import {useState} from "react";

export interface IPagingSessionStoreEntry {
    key: any;
    pageNumber: number;
    pageSize: number;
    context?: any;
}

export interface IPagingSessionStoreContext {
    entries: IPagingSessionStoreEntry[];
    setEntry: (entry: IPagingSessionStoreEntry) => void;
    removeEntry: (key: any) => void;
}

const defaultState: IPagingSessionStoreContext = {
    entries: [],
    setEntry: () => {},
    removeEntry: () => {},
};

const PagingSessionStoreContext = React.createContext<IPagingSessionStoreContext>(defaultState);

const PagingSessionStoreContextProvider = (props: any) => {
    const sessionStoreKey = "persistent_asyncpaging_entries";
    const loadFromStorage = () => {
        const res = localStorage.getItem(sessionStoreKey);
        return JSON.parse(res || "[]") as IPagingSessionStoreEntry[];
    }

    const [entries, setStateEntries] = useState<IPagingSessionStoreEntry[]>(loadFromStorage());
    

    const removeEntry = (key: any) => {
        const oldEntryIndex = entries.findIndex((e: IPagingSessionStoreEntry) => e.key === key);
        let oldEntries = [...entries];
        if (oldEntryIndex >= 0) {
            oldEntries.splice(oldEntryIndex);
        }

        const newEntries  = [...oldEntries];
        saveToStorage(newEntries);
        setStateEntries(newEntries);
    };

    const saveToStorage = (entries: IPagingSessionStoreEntry[]) => {
        localStorage.setItem(sessionStoreKey, JSON.stringify(entries));
    };

    const saveEntry = (entry: IPagingSessionStoreEntry) => {
        const oldEntryIndex = entries.findIndex((e: IPagingSessionStoreEntry) => e.key === entry.key);
        let oldEntries = [...entries];
        if (oldEntryIndex >= 0) {
            oldEntries.splice(oldEntryIndex);
        }

        const newEntries  = [...oldEntries, entry];
        saveToStorage(newEntries);
        setStateEntries(newEntries);
    }

    return (
        <PagingSessionStoreContext.Provider
            value={{
                entries,
                removeEntry,
                setEntry: saveEntry,
            }}
        >
            {props.children}
        </PagingSessionStoreContext.Provider>
    );
};


export {
    PagingSessionStoreContext,
    PagingSessionStoreContextProvider
};
