import { EnumerableBase } from "../_internal.ts";

export class OfTypeEnumerable<S, T extends S> extends EnumerableBase<S, T>
{
    constructor(
        originalSource: Iterable<S>,
        private readonly typePredicate: (item: S) => item is T
    )
    {
        super(originalSource);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        for (const item of this.source)
        {
            if (this.typePredicate(item))
            {
                yield item;
            }
        }
    }
}
