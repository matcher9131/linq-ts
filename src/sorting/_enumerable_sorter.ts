import type { Comparer } from "../comparer/_comparer.ts";
import type { IEnumerableSorter } from "./_ienumerable_sorter.ts";

export class EnumerableSorter<T, K> implements IEnumerableSorter<T>
{
    private keys: K[] = [];

    constructor(
        private readonly keySelector: (item : T) => K,
        private readonly comparer: Comparer<K>,
        private readonly descending: boolean,
        private readonly child?: IEnumerableSorter<T>
    )
    {
    }

    computeKeys(items: readonly T[]): void
    {
        this.keys = items.map(item => this.keySelector(item));

        if (this.child !== undefined)
        {
            this.child.computeKeys(items);
        }
    }

    // Declare as arrow function so that 'this' point to this instance when called by 'Array.prototype.sort'.
    readonly compareKeys = (index1: number, index2: number): number =>
    {
        const c = this.comparer(this.keys[index1], this.keys[index2]);
        if (c === 0)
        {
            return this.child === undefined ? index1 - index2 : this.child.compareKeys(index1, index2);
        }
        else
        {
            return this.descending ? -c : c;
        }
    }

    getSortedIndices(items: T[]): number[]
    {
        this.computeKeys(items);
        const indices = items.map((_, i) => i);
        indices.sort(this.compareKeys);
        return indices;
    }
}