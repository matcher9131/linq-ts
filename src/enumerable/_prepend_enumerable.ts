import { Enumerable } from "../_internal.ts";

export class PrependEnumerable<T> extends Enumerable<T>
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
        yield this.item;
        for (const item of this.source)
        {
            yield item;
        }
    }
}
