import { Enumerable } from "../_internal.ts";

export class UnionEnumerable<T> extends Enumerable<T>
{
    constructor(
        first: Iterable<T>,
        private readonly second: Iterable<T>
    )
    {
        super(first);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        const set = new Set();
        for (const item of this.source)
        {
            if (!set.has(item))
            {
                set.add(item);
                yield item;
            }
        }
        for (const item of this.second)
        {
            if (!set.has(item))
            {
                set.add(item);
                yield item;
            }
        }
    }
}