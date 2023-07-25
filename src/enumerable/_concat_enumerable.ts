//import { Enumerable } from "./Enumerable.ts";
import { Enumerable } from "../_internal.ts";

export class ConcatEnumerable<T> extends Enumerable<T>
{
    constructor(
        first: Iterable<T>,
        private readonly second: Iterable<T>
    )
    {
        super(first);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        for (const item of this.source)
        {
            yield item;
        }
        for (const item of this.second)
        {
            yield item;
        }
    }
}