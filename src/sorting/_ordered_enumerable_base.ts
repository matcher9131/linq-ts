import type { Comparer } from "../comparer/_comparer.ts";
import type { IEnumerableSorter } from "./_ienumerable_sorter.ts";
import type { IOrderedEnumerable } from "./_iordered_enumerable.ts";
import { Enumerable } from "../_internal.ts";

export abstract class OrderedEnumerableBase<T> extends Enumerable<T> implements IOrderedEnumerable<T>
{
    constructor(
        source: Iterable<T>
    )
    {
        super(source);
    }

    private getSortedIndices(items: readonly T[]): readonly number[]
    {
        const sorter = this.getEnumerableSorter();
        return sorter.getSortedIndices(items);
    }

    *[Symbol.iterator](): Iterator<T>
    {
        const items = [...this.source];
        const indices = this.getSortedIndices(items);
        for (const index of indices)
        {
            yield items[index];
        }
    }

    abstract getEnumerableSorter(child?: IEnumerableSorter<T>): IEnumerableSorter<T>;

    //abstract getCachingComparer(child: CachingComparer<T>): CachingComparer<T>;

    abstract thenBy<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>;

    abstract thenByDescending<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>;
}