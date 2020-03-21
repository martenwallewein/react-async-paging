import { times } from "../src/util/times";
import * as React from 'react';
import { AsyncPagingSessionStore } from "../src/components/sessionstore/AsyncPagingSessionStore";
import { IFetchDataFunc } from "../src/types/FetchData";
import { IAsyncPagingItemStore } from "../src/types/AsyncPaging";
// @ts-ignore
import Select from 'react-select'
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


const options = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
];

export const ExternalList = () => {
    const [items, setItems] = React.useState<IAsyncPagingItemStore<number>>({});
    const [pageSize/*, setPageSize*/] = React.useState(5);
    const [sorting, setSorting] = React.useState(options[0]);

    /*React.useEffect(() => {
        setTimeout(() => {
            setPageSize(10);
        }, 3000)
    }, []);*/
    return (
        <div>
        <Select options={options} value={sorting} onChange={(e: any) => setSorting(e)}/>
        <AsyncPagingSessionStore
            fetchPage={fetchPage}
            pageSize={pageSize}
            items={items}
            setItems={setItems}
            entryId="externalList"
            pkey={sorting.value}
        >
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
        </AsyncPagingSessionStore>
        </div>
    )
}
