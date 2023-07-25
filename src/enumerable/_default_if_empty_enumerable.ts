//import { Enumerable } from "./Enumerable.ts";
import { Enumerable } from "../_internal.ts";

export class DefaultIfEmptyEnumerable<T> extends Enumerable<T>
{
    constructor(
        source: Iterable<T>,
        private readonly defaultValue: T
    )
    {
        super(source);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        const iterator = this.source[Symbol.iterator]();
        let iteratorResult = iterator.next();
        if (iteratorResult.done)
        {
            yield this.defaultValue;
        }
        else
        {
            yield iteratorResult.value;
            while (true)
            {
                iteratorResult = iterator.next();
                if (iteratorResult.done) return;
                yield iteratorResult.value;
            }
        }
    }
}