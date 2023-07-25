import type { IEnumerable } from "./_ienumerable.ts";
import { EnumerableBase } from "../_internal.ts";

export class WhereSelectEnumerable<S, T> extends EnumerableBase<S, T>
{
    constructor(
        originalSource: Iterable<S>,
        private readonly predicate: (item: S) => boolean,
        private readonly selector: (item: S, index: number) => T
    )
    {
        super(originalSource);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        if (this.selector.length === 1)
        {
            const selector = this.selector as ((item: S) => T);
            for (const item of this.source)
            {
                if (this.predicate(item))
                {
                    yield selector(item);
                }
            }
        }
        else
        {
            let index = 0;
            for (const item of this.source)
            {
                if (this.predicate(item))
                {
                    yield this.selector(item, index);
                    ++index;
                }
            }
        }
    }

    select<U>(selector: (item: T, index: number) => U): IEnumerable<U>
    {
        //return EnumerableFactory.createWhereSelect(this.source, this.predicate, (item: S, index: number) => selector(this.selector(item, index), index));
        return new WhereSelectEnumerable(this.source, this.predicate, (item: S, index: number) => selector(this.selector(item, index), index));
    }
}