import { EnumerableBase } from "../_internal.ts";

export class SelectManyEnumerable<T, R> extends EnumerableBase<T, R>
{
    constructor(
        originalSource: Iterable<T>,
        private readonly selector: (item: T, index: number) => Iterable<R>
    )
    {
        super(originalSource);
    }

    *[Symbol.iterator](): Iterator<R>
    {
        if (this.selector.length === 1)
        {
            const selector = this.selector as (item: T) => Iterable<R>;
            for (const item of this.source)
            {
                for (const innerItem of selector(item))
                {
                    yield innerItem;
                }
            }
        }
        else
        {
            let index = 0;
            for (const item of this.source)
            {
                for (const innerItem of this.selector(item, index))
                {
                    yield innerItem;
                }
                ++index;
            }
        }
    }
}