# React Async Paging
Provides a react component that implements pagination with asynchronous (promise-based) requests and ensures smooth transitions at page changes.

This library does not uses DOM elements and consequently not depends on any UI library. Consequently, only pagination logic is contained.

## Concepts
The core concept of this library is to keep a list of data items and fills it providing an async pagination api to fetch items. 

### Caching
By default, each page is fetched only once while the paging component is rendered. If a page is accessed another time, it will not trigger a data fetch but use the data that is locally available.

### External List State
By default this library keeps the data items in an internal state. To have the items outside the paging component (e.g. in a react context), simply pass the `items` prop.

## Usage

Default with internal State
```tsx=
import { times } from "../util/times";
import * as React from 'react';
import { AsyncPaging } from "../components/AsyncPaging";
import { IFetchDataFunc } from "../types/FetchData";
// Imagine this array is on your server...
const items = times(100);

// ...and this method fetches the corresponding items from the server
const fetchPage: IFetchDataFunc<number> = (pageNumber: number, pageSize: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const res  = items.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);
            resolve([res]);
        }, 1000);
    })
   
}

export const InternalList = () => {
    return (
        <AsyncPaging fetchPage={fetchPage} pageSize={5} itemCount={100}>
        {
            (items, {
                currentPage,
                pageCount,
                pages,
            }, {
                goto,
                back,
                next,
                first,
                last,
            }) =>
                <div>
                    <ul>
                        {items.map(i => <li>{i}</li>)}
                    </ul>
                    <button onClick={first}>First</button>
                    <button onClick={back}>Back</button>
                    {
                          pages.map(p => 
                            <button onClick={() => goto(p)}>
                                {p === currentPage ? <b>{p}</b> : p}
                            </button>)  
                    }
                    <button onClick={next}>Next</button>
                    <button onClick={last}>Last</button>
                    <br />
                    <span>PageCount: {pageCount}</span>
                </div>
        }
        </AsyncPaging>
    )
}


```


External State and fetchPage meta information
```tsx=
import { times } from "../util/times";
import * as React from 'react';
import { AsyncPaging } from "../components/AsyncPaging";
import { IFetchDataFunc } from "../types/FetchData";
import { IAsyncPagingItemStore } from "../types/AsyncPaging";
// Imagine this array is on your server...
const items = times(100);

// ...and this method fetches the corresponding items from the server
const fetchPage: IFetchDataFunc<number> = (pageNumber: number, pageSize: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const res  = items.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);
            resolve([res]);
        }, 1000);
    })
   
}

export const ExternalList = () => {
    const [items, setItems] = React.useState<IAsyncPagingItemStore<number>>({});

    return (
        <AsyncPaging fetchPage={fetchPage} pageSize={5} itemCount={100} items={items} setItems={setItems}>
        {
            (items, {
                currentPage,
                pageCount,
                pages,
            }, {
                goto,
                back,
                next,
                first,
                last,
            }) =>
                <div>
                    <ul>
                        {items.map(i => <li>{i}</li>)}
                    </ul>
                    <button onClick={first}>First</button>
                    <button onClick={back}>Back</button>
                    {
                          pages.map(p => 
                            <button onClick={() => goto(p)}>
                                {p === currentPage ? <b>{p}</b> : p}
                            </button>)  
                    }
                    <button onClick={next}>Next</button>
                    <button onClick={last}>Last</button>
                    <br />
                    <span>PageCount: {pageCount}</span>
                </div>
        }
        </AsyncPaging>
    )
}

```