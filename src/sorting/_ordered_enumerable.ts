import type { IEnumerableSorter } from "./_ienumerable_sorter.ts";
import type { IOrderedEnumerable } from "./_iordered_enumerable.ts";
import type { Comparer } from "../comparer/_comparer.ts";
import { defaultComparer } from "../comparer/_comparer.ts";
import { EnumerableSorter } from "./_enumerable_sorter.ts";
import { OrderedEnumerableBase } from "../_internal.ts";

export class OrderedEnumerable<T, K> extends OrderedEnumerableBase<T>
{
    constructor(
        source: Iterable<T>,
        private readonly keySelector: (item :T) => K,
        private readonly comparer?: Comparer<K>,
        private readonly isDescending?: boolean,
        private readonly parent?: OrderedEnumerableBase<T>
    )
    {
        super(source);
    }

    getEnumerableSorter(child?: IEnumerableSorter<T>): IEnumerableSorter<T>
    {
        const sorter = new EnumerableSorter(this.keySelector, this.comparer ?? defaultComparer, this.isDescending ?? false, child);
        if (this.parent === undefined)
        {
            return sorter;
        }
        else
        {
            return this.parent.getEnumerableSorter(sorter);
        }
    }

    thenBy<K2>(keySelector: (item :T) => K2, comparer?: Comparer<K2>): IOrderedEnumerable<T>
    {
        //return EnumerableFactory.createOrder(this.source, keySelector, comparer, false, this);
        return new OrderedEnumerable<T, K2>(this.source, keySelector, comparer, false, this);
    }

    thenByDescending<K2>(keySelector: (item :T) => K2, comparer?: Comparer<K2>): IOrderedEnumerable<T>
    {
        //return EnumerableFactory.createOrder(this.source, keySelector, comparer, true, this);
        return new OrderedEnumerable<T, K2>(this.source, keySelector, comparer, true, this);
    }
}