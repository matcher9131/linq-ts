import { Enumerable } from "../_internal.ts";

export class AppendEnumerable<T> extends Enumerable<T>
{
    constructor(
        source: Iterable<T>,
        private readonly item: T
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
        yield this.item;
    }
}