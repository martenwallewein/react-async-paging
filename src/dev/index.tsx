import ReactDOM from "react-dom";
import * as React from "react";
import { InternalList } from './InternalList';

// Render App
const appContext = (
   <InternalList />
);

ReactDOM.render(
    appContext,
    document.getElementById("root") as HTMLElement
);
