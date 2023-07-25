import { Enumerable } from "../_internal.ts";

export class ReverseEnumerable<T> extends Enumerable<T>
{
    constructor(
        source: Iterable<T>
    )
    {
        super(source);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        const buffer = [...this].reverse();
        for (const item of buffer)
        {
            yield item;
        }
    }
}
