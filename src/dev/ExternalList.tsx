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
            resolve([res, {itemCount: 100}]);
        }, 1000);
    })
   
}

export const ExternalList = () => {
    const [items, setItems] = React.useState<IAsyncPagingItemStore<number>>({});

    return (
        <AsyncPaging fetchPage={fetchPage} pageSize={5} items={items} setItems={setItems}>
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
