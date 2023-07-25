import { EnumerableBase } from "../_internal.ts";

export class ZipEnumerable<T, U, R> extends EnumerableBase<T, R>
{
    constructor(
        firstSource: Iterable<T>,
        private readonly secondSource: Iterable<U>,
        private readonly resultSelector: (firstItem: T, secondItem: U) => R
    )
    {
        super(firstSource);
    }

    *[Symbol.iterator](): Iterator<R>
    {
        const firstIterator = this.source[Symbol.iterator]();
        const secondIterator = this.secondSource[Symbol.iterator]();
        while (true)
        {
            const firstResult = firstIterator.next();
            const secondReuslt = secondIterator.next();
            if (firstResult.done === true || secondReuslt.done === true) return;
            yield this.resultSelector(firstResult.value, secondReuslt.value);
        }
    }
}