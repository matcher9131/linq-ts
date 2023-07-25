import { Enumerable } from "../_internal.ts";

export class DistinctEnumerable<T> extends Enumerable<T>
{
    constructor(source: Iterable<T>)
    {
        super(source);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        const set = new Set<T>();
        for (const item of this.source)
        {
            if (!set.has(item))
            {
                set.add(item);
                yield item;
            }
        }
    }
}