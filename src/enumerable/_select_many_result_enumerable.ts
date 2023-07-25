import { EnumerableBase } from "../_internal.ts";

export class SelectManyResultEnumerable<T, U, R> extends EnumerableBase<T, R>
{
    constructor(
        originalSource: Iterable<T>,
        private readonly collectionSelector: (item: T, index: number) => Iterable<U>,
        private readonly resultSelector: (item: T, collectionItem: U) => R
    )
    {
        super(originalSource);
    }

    *[Symbol.iterator](): Iterator<R>
    {
        if (this.collectionSelector.length === 1)
        {
            const collectionSelector = this.collectionSelector as (item: T) => Iterable<U>;
            for (const item of this.source)
            {
                for (const collectionItem of collectionSelector(item))
                {
                    yield this.resultSelector(item, collectionItem);
                }
            }
        }
        else
        {
            let index = 0;
            for (const item of this.source)
            {
                for (const collectionItem of this.collectionSelector(item, index))
                {
                    yield this.resultSelector(item, collectionItem);
                }
                ++index;
            }
        }
    }
}