import type { Comparer, EqualityComparer } from "../comparer/_comparer.ts";
import type { IGrouping } from "../grouping/_igrouping.ts";
import type { IOrderedEnumerable } from "../sorting/_iordered_enumerable.ts";

export interface IEnumerable<T> extends Iterable<T>
{
    aggregate<U, R>(func: (accumlator: U, currentValue: T) => U, seed: U, resultSelector: (accumlator: U) => R): R;
    aggregate<U>(func: (accumlator: U, currentValue: T) => U, seed: U): U;
    aggregate(func: (accumlator: T, currentValue: T) => T): T;
    all(predicate: (item: T) => boolean): boolean;
    any(predicate?: (item: T) => boolean): boolean;
    append(item :T): IEnumerable<T>;
    average(selector: (item: T) => number): number;
    concat(second: Iterable<T>): IEnumerable<T>;
    contains(value: T, comparer?: EqualityComparer<T>): boolean;
    count(predicate?: (item: T) => boolean): number;
    defaultIfEmpty(defaultValue: T): IEnumerable<T>;
    distinct(): IEnumerable<T>;
    elementAt(index: number): T;
    elementAtOrNull(index: number): T | null;
    except(second: Iterable<T>): IEnumerable<T>;
    first(predicate?: (item : T) => boolean): T;
    firstOrNull(predicate?: (item : T) => boolean): T | null;
    groupBy<K, E, R>(keySelector: (item: T) => K, elementSelector: (item: T) => E, resultSelector: (key: K, items: IEnumerable<E>) => R): IEnumerable<R>;
    groupBy<K, E>(keySelector: (item: T) => K, elementSelector: (item: T) => E): IEnumerable<IGrouping<K, E>>;
    groupBy<K, R>(keySelector: (item: T) => K, resultSelector: (key: K, items: IEnumerable<T>) => R): IEnumerable<R>;
    groupBy<K>(keySelector: (item: T) => K): IEnumerable<IGrouping<K, T>>;
    groupJoin<I, K, R>(inner: Iterable<I>, outerKeySelector: (item: T) => K, innerKeySelector: (item: I) => K, resultSelector: (outer: T, innerItems: IEnumerable<I>) => R): IEnumerable<R>;
    intersect(second: Iterable<T>): IEnumerable<T>;
    join<I, K, R>(inner: Iterable<I>, outerKeySelector: (item: T) => K, innerKeySelector: (item: I) => K, resultSelector: (outer: T, inner: I) => R): IEnumerable<R>;
    last(predicate?: (item : T) => boolean): T;
    lastOrNull(predicate?: (item : T) => boolean): T | null;
    max(selector: (item: T) => number): number;
    min(selector: (item: T) => number): number;
    ofType<U extends T>(typePredicate: (item: T) => item is U): IEnumerable<U>;
    orderBy<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>;
    orderByDescending<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>;
    prepend(item: T): IEnumerable<T>;
    reverse(): IEnumerable<T>;
    select<U>(selector: (item: T, index: number) => U): IEnumerable<U>;
    selectMany<U, R>(collectionSelector: (item: T, index: number) => Iterable<U>, resultSelector: (item: T, collectionItem: U) => R): IEnumerable<R>;
    selectMany<R>(selector: (item: T, index: number) => Iterable<R>): IEnumerable<R>;
    sequenceEqual(second: Iterable<T>): boolean;
    single(predicate?: (item : T) => boolean): T;
    singleOrNull(predicate?: (item : T) => boolean): T | null;
    skip(count: number): IEnumerable<T>;
    skipWhile(predicate: (item: T) => boolean): IEnumerable<T>;
    sum(selector: (item: T) => number): number;
    take(count: number): IEnumerable<T>;
    takeWhile(predicate: (item: T) => boolean): IEnumerable<T>;
    toArray(): T[];
    toMap<K, U>(keySelector: (item: T) => K, elementSelector: (item: T) => U): Map<K, U>;
    toMap<K>(keySelector: (item: T) => K): Map<K, T>;
    // toSet (toHashSet)
    union(second: Iterable<T>): IEnumerable<T>;
    where(predicate: (item: T) => boolean): IEnumerable<T>;
    zip<U, R>(second: Iterable<U>, resultSelector: (firstItem: T, secondItem: U) => R): IEnumerable<R>;
    zip<U>(second: Iterable<U>): IEnumerable<[T, U]>;
}