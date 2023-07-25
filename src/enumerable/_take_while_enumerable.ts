import { Enumerable } from "../_internal.ts";

export class TakeWhileEnumerable<T> extends Enumerable<T>
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
        const iterator = this.source[Symbol.iterator]();
        while (true)
        {
            const iteratorResult = iterator.next();
            if (iteratorResult.done === true) return;
            if (this.predicate(iteratorResult.value))
            {
                yield iteratorResult.value;
            }
            else
            {
                return;
            }
        }
    }
}
