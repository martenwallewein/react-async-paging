import ReactDOM from "react-dom";
import * as React from "react";
import { InternalList } from './InternalList';
import { ExternalList } from "./ExternalList";

// Render App
const appContext = (
    <div>
    <InternalList />
    <ExternalList />
   </div>
);

ReactDOM.render(
    appContext,
    document.getElementById("root") as HTMLElement
);
