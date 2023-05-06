export function distinctByReverse<T, R>(list: T[], selector: (item: T) => R): T[] {
    return distinctBy(list.reverse(), selector).reverse();
}
 
export function distinctBy<T, R>(list: T[], selector: (item: T) => R): T[] {
    const result: T[] = [];
    const set = new Set<R>();
    list.forEach((item) => {
        const select = selector(item)
        if (!set.has(select)) {
            set.add(select)
            result.push(item);
        }
    })
    return result;
}
