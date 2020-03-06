
export const getQueryParams = (search: string) => {
    if (!search || search === "") {
        return null;
    }
    const resultArr = search.replace("?", "").split("&").map(p => {
        const parts = p.split("=");
        return {
            key: parts[0],
            value: parts[1],
        };
    });

    const result: any = {};
    resultArr.forEach(e => result[e.key] = e.value);
    return result;
};

export const queryArgsToString = (args: any) => {
    return args ? Object.keys(args).filter((k) => args[k] !== undefined).map((k) => `${k}=${args[k]}`).join("&") : null;
};

export const addQueryArgsToLocation = (location: string, queryArgs: any) => {
    const queryArgsString = queryArgsToString(queryArgs);

    if (location.indexOf("?") >= 0) {
        return `${location}&${queryArgsString}`;
    } else {
        return `${location}?${queryArgsString}`;
    }
};
