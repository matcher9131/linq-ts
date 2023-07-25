export type Comparer<T> = (x: T, y: T) => number;
export type EqualityComparer<T> = (x: T, y: T) => boolean;

export function defaultComparer<T>(x: T, y: T): number
{
    return String(x).length - String(y).length;
}