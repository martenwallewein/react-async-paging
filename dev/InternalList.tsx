import { times } from "../src/util/times";
import * as React from 'react';
import { AsyncPaging } from "../src/components/AsyncPaging";
import { IFetchDataFunc } from "../src/types/FetchData";
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
