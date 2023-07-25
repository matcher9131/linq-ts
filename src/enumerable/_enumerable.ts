import { EnumerableBase } from "../_internal.ts";

export class Enumerable<T> extends EnumerableBase<T, T>
{
    constructor(
        protected readonly source: Iterable<T>
    )
    {
        super(source);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        for (const item of this.source)
        {
            yield item;
        }
    }
}
