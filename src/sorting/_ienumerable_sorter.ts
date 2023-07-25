export interface IEnumerableSorter<T>
{
    computeKeys(items: readonly T[]): void;

    compareKeys(index1: number, index2: number): number;

    getSortedIndices(items: readonly T[]): readonly number[];
}