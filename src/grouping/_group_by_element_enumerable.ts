import type { IGrouping } from "../grouping/_igrouping.ts";
import { Grouping } from "../grouping/_grouping.ts";
import { Enumerable, EnumerableBase } from "../_internal.ts";

export class GroupByElementEnumerable<T, K, E> extends EnumerableBase<T, IGrouping<K, E>>
{
    constructor(
        originalSource: Iterable<T>,
        private readonly keySelector: (item: T) => K,
        private readonly elementSelector: (item: T) => E
    )
    {
        super(originalSource);
    }

    *[Symbol.iterator](): Iterator<IGrouping<K, E>>
    {
        // with elementSelector, without resultSelector
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
            yield new Grouping(key, new Enumerable(value));
        }
    }
}