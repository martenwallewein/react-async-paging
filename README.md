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
import {times} from 'lodash';

// Imagine this array is on your server...
const items = times(100);

// ...and this method fetches the corresponding items from the server
const fetchPage = async (pageNumber: number, pageSize: number) => {
    return times.slice(pageNumber, pageSize);
}

const MyPaginatedList = () => {
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
                          pages.map(p => <button onClick={() => goto(p)}>{p}</button>)  
                    }
                    <button onClick={next}>Next</button>
                    <button onClick={last}>Last</button>
                </div>
        }
        </AsyncPaging>
    )
}

```


External State and fetchPage meta information
```tsx=
import {times} from 'lodash';

const items = times(100);

const fetchPage = async (pageNumber: number, pageSize: number) => {
    return [times.slice(pageNumber, pageSize), {
        // ItemCount may be fetched with the pages itself, so it can be 
        // useful to allow it to be set here
        itemCount: 100,
    }];
}

const MyPaginatedList = () => {

    // This array is filled with each fetchPage request
    const [paginatedItems, setPaginatedItems] = useState<any>([]);

    return (
        // Having paginatedItems passed to this, we also have to add setItems
        <AsyncPaging fetchPage={fetchPage} pageSize={5} items={paginatedItems} setItems={setPaginatedItems}>
        {
            (items, {
                currentPage,
                pageCount,
                pages,
                fetchState,
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
                          pages.map(p => <button onClick={() => goto(p)}>{p}</button>)  
                    }
                    <button onClick={next}>Next</button>
                    <button onClick={last}>Last</button>
                </div>
        }
        </AsyncPaging>
    )
}

```