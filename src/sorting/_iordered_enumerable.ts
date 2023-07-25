import type { Comparer } from "../comparer/_comparer.ts";
import type { IEnumerable } from "../enumerable/_ienumerable.ts";

export interface IOrderedEnumerable<T> extends IEnumerable<T>
{
    thenBy<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>;
    thenByDescending<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>;
}