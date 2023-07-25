import type { IEnumerable } from "../enumerable/_ienumerable.ts";
import { Enumerable, EnumerableBase } from "../_internal.ts";

export class GroupByResultEnumerable<T, K, E, R> extends EnumerableBase<T, R>
{
    constructor(
        originalSource: Iterable<T>,
        private readonly keySelector: (item: T) => K,
        private readonly elementSelector: ((item: T) => E) | null,
        private readonly resultSelector: ((key: K, items: IEnumerable<E>) => R) | ((key: K, items: IEnumerable<T>) => R)
    )
    {
        super(originalSource);
    }

    *[Symbol.iterator](): Iterator<R>
    {
        if (this.elementSelector === null)
        {
            // without elementSelector, with resultSelector
            const resultSelector = this.resultSelector as (key: K, items: IEnumerable<T>) => R;

            const map = new Map<K, T[]>();
            for (const item of this.source)
            {
                const key = this.keySelector(item);
                if (map.has(key))
                {
                    map.get(key)!.push(item);
                }
                else
                {
                    map.set(key, [item]);
                }
            }

            for (const [key, value] of map.entries())
            {
                yield resultSelector(key, new Enumerable(value));
            }            
        }
        else
        {
            // with elementSelector, with resultSelector
            const resultSelector = this.resultSelector as (key: K, items: IEnumerable<E>) => R;

            const map = new Map<K, E[]>();
            for (const item of this.source)
            {
                const key = this.keySelector(item);
                const element = this.elementSelector(item);
                if (map.has(key))
                {
                    map.get(key)!.push(element);
                }
                else
                {
                    map.set(key, [element]);
                }
            }

            for (const [key, value] of map.entries())
            {
                yield resultSelector(key, new Enumerable(value));
            }
        }
    }
}