import type { IEnumerable } from "./_ienumerable.ts";
import { Enumerable } from "../_internal.ts";

export class PartialEnumerable<T> extends Enumerable<T>
{
    constructor(
        source: Iterable<T>,
        private readonly startIndex: number,
        private readonly itemsCount: number | null
    )
    {
        super(source);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        const iterator = this.source[Symbol.iterator]();
        for (let i = 0; i < this.startIndex; ++i)
        {
            const iteratorResult = iterator.next();
            if (iteratorResult.done === true) return;
        }

        if (this.itemsCount === null)
        {
            while (true)
            {
                const iteratorResult = iterator.next();
                if (iteratorResult.done === true) return;
                yield iteratorResult.value;
            }
        }
        else
        {
            for (let j = 0; j < this.itemsCount; ++j)
            {
                const iteratorResult = iterator.next();
                if (iteratorResult.done === true) return;
                yield iteratorResult.value;
            }
        }
    }

    skip(count: number): IEnumerable<T>
    {
        //return EnumerableFactory.createPartial(this.source, this.startIndex + (count > 0 ? count : 0), this.itemsCount);
        return new PartialEnumerable(this.source, this.startIndex + (count > 0 ? count : 0), this.itemsCount);
    }

    take(count: number): IEnumerable<T>
    {
        //return EnumerableFactory.createPartial(this.source, this.startIndex, (this.itemsCount ?? 0) + (count > 0 ? count : 0));
        return new PartialEnumerable(this.source, this.startIndex, (this.itemsCount ?? 0) + (count > 0 ? count : 0));
    }
}
