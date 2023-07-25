import { EnumerableBase } from "../_internal.ts";

export class JoinEnumerable<T, I, K, R> extends EnumerableBase<T, R>
{
    constructor(
        outerSource: Iterable<T>,
        private readonly innerSource: Iterable<I>,
        private readonly outerKeySelector: (item: T) => K,
        private readonly innerKeySelector: (item: I) => K,
        private readonly resultSelector: (outer: T, inner: I) => R
    )
    {
        super(outerSource);
    }

    *[Symbol.iterator](): Iterator<R>
    {
        const outerMap = new Map<K, T>();
        const innerMap = new Map<K, I[]>();
        for (const outerItem of this.source)
        {
            const outerKey = this.outerKeySelector(outerItem);
            if (!outerMap.has(outerKey))
            {
                outerMap.set(outerKey, outerItem);
            }
        }
        for (const innerItem of this.innerSource)
        {
            const innerKey = this.innerKeySelector(innerItem);
            if (innerMap.has(innerKey))
            {
                innerMap.get(innerKey)!.push(innerItem);
            }
            else
            {
                innerMap.set(innerKey, [innerItem]);
            }
        }

        for (const [key, value] of outerMap)
        {
            const innerItems = innerMap.get(key) ?? [];
            for (const innerItem of innerItems)
            {
                yield this.resultSelector(value, innerItem);
            }
        }
    }
}