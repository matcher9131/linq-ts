import { Enumerable } from "../_internal.ts";

export class IntersectEnumerable<T> extends Enumerable<T>
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
        const set = new Set(this.second);
        for (const item of this.source)
        {
            if (set.delete(item))
            {
                yield item;
            }
        }
    }
}