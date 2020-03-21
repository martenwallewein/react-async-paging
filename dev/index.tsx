import ReactDOM from "react-dom";
import * as React from "react";
import { InternalList } from './InternalList';
import { ExternalList } from "./ExternalList";
import { PagingSessionStoreContextProvider } from "../src/components/sessionstore/PagingSessionStore";
// Render App
const appContext = (
    <div>
        <PagingSessionStoreContextProvider>
            <InternalList />
            <ExternalList />
        </PagingSessionStoreContextProvider>
   </div>
);

ReactDOM.render(
    appContext,
    document.getElementById("root") as HTMLElement
);
