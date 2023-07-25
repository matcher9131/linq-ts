import type { IEnumerable } from "./_ienumerable.ts";
import { Enumerable, WhereSelectEnumerable } from "../_internal.ts";

export class WhereEnumerable<T> extends Enumerable<T>
{
    constructor(
        source: Iterable<T>,
        private readonly predicate: (item: T) => boolean
    )
    {
        super(source);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        for (const item of this.source)
        {
            if (this.predicate(item))
            {
                yield item;
            }
        }
    }

    select<U>(selector: (item: T, index: number) => U): IEnumerable<U>
    {
        //return EnumerableFactory.createWhereSelect(this.source, this.predicate, selector);
        return new WhereSelectEnumerable(this.source, this.predicate, selector);
    }
}