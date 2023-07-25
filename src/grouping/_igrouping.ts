import type { IEnumerable } from "../enumerable/_ienumerable.ts";

export interface IGrouping<K, T> extends IEnumerable<T>
{
    readonly key: K
}