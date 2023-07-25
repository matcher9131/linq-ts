import { Grouping } from "../grouping/_grouping.ts";
import type { IGrouping } from "../grouping/_igrouping.ts";
import { Enumerable, EnumerableBase } from "../_internal.ts";

export class GroupByEnumerable<T, K> extends EnumerableBase<T, IGrouping<K, T>>
{
    constructor(
        originalSource: Iterable<T>,
        private readonly keySelector: (item: T) => K,
    )
    {
        super(originalSource);
    }

    *[Symbol.iterator](): Iterator<IGrouping<K, T>>
    {
        // without elementSelector, without resultSelector
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
            yield new Grouping(key, new Enumerable(value));
        } 
    }
}