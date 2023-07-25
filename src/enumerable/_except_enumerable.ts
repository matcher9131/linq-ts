import { Enumerable } from "../_internal.ts";
//import { Enumerable } from "./Enumerable.ts";

export class ExceptEnumerable<T> extends Enumerable<T>
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
        const set = new Set(this.second);
        for (const item of this.source)
        {
            if (!set.has(item))
            {
                set.add(item);
                yield item;
            }
        }
    }
}