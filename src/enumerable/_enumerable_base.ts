import type { Comparer, EqualityComparer } from "../comparer/_comparer.ts";
import type { IEnumerable } from "./_ienumerable.ts";
import type { IGrouping } from "../grouping/_igrouping.ts";
import type { IOrderedEnumerable } from "../sorting/_iordered_enumerable.ts";
import { errorMoreThanOneMatch, errorNoElements, errorNoMatch, errorOutOfIndex } from "../error/_error_message.ts";
import { EnumerableError } from "../error/_enumerable_error.ts";
import {
    AppendEnumerable, 
    ConcatEnumerable, 
    DefaultIfEmptyEnumerable, 
    DistinctEnumerable, 
    ExceptEnumerable, 
    GroupByElementEnumerable, 
    GroupByEnumerable, 
    GroupByResultEnumerable, 
    GroupJoinEnumerable, 
    IntersectEnumerable, 
    JoinEnumerable, 
    OfTypeEnumerable, 
    OrderedEnumerable, 
    PartialEnumerable, 
    PrependEnumerable, 
    ReverseEnumerable, 
    SelectManyEnumerable, 
    SelectManyResultEnumerable, 
    SkipWhileEnumerable, 
    TakeWhileEnumerable, 
    UnionEnumerable, 
    WhereEnumerable, 
    WhereSelectEnumerable, 
    ZipEnumerable
} from "../_internal.ts";

export abstract class EnumerableBase<S, T> implements IEnumerable<T>
{
    constructor(protected readonly source: Iterable<S>)
    {
    }

    abstract [Symbol.iterator](): Iterator<T>;

    aggregate<U, R>(func: (accumlator: U, currentValue: T) => U, seed: U, resultSelector: (accumlator: U) => R): R;
    aggregate<U>(func: (accumlator: U, currentValue: T) => U, seed: U): U;
    aggregate(func: (accumlator: T, currentValue: T) => T): T;
    aggregate<U, R>(func: ((accumlator: U, currentValue: T) => U) | ((accumlator: T, currentValue: T) => T), seed?: U, resultSelector?: (accumlator: U) => R): U | T | R
    {
        if (seed == undefined)
        {
            const f = func as ((accumlator: T, currentValue: T) => T);
            const iterator = this[Symbol.iterator]();
            let iteratorResult = iterator.next();
            if (iteratorResult.done === true) throw new EnumerableError(errorNoElements);
            let result = iteratorResult.value;
            while (true)
            {
                iteratorResult = iterator.next();
                if (iteratorResult.done === true) return result;
                result = f(result, iteratorResult.value);
            }
        }
        else
        {
            const f = func as ((accumlator: U, currentValue: T) => U);
            let result = seed as U;
            for (const item of this)
            {
                result = f(result, item);
            }
            return resultSelector === undefined ? result : resultSelector(result);
        }
    }

    all(predicate: (item: T) => boolean): boolean
    {
        for (const item of this)
        {
            if (!predicate(item))
            {
                return false;
            }
        }
        return true;
    }

    any(predicate?: (item: T) => boolean): boolean
    {
        if (predicate === undefined)
        {
            return this[Symbol.iterator]().next().done !== true;
        }
        else
        {
            for (const item of this)
            {
                if (predicate(item))
                {
                    return true;
                }
            }
            return false;
        }
    }

    append(item :T): IEnumerable<T>
    {
        return new AppendEnumerable(this, item);
    }

    average(selector: (item: T) => number): number
    {
        let sum = 0;
        let count = 0;
        for (const item of this)
        {
            sum += selector(item);
            ++count;
        }
        if (count === 0) throw new EnumerableError(errorNoElements);
        return sum / count;
    }

    concat(second: Iterable<T>): IEnumerable<T>
    {
        return new ConcatEnumerable(this, second);
    }

    contains(value: T, comparer?: EqualityComparer<T>): boolean
    {
        if (comparer === undefined)
        {
            for (const item of this)
            {
                if (item === value)
                {
                    return true;
                }
            }
            return false;
        }
        else
        {
            for (const item of this)
            {
                if (comparer(value, item))
                {
                    return true;
                }
            }
            return false;
        }
    }

    count(predicate?: (item: T) => boolean): number
    {
        if (predicate === undefined)
        {
            let count = 0;
            for (const _ of this)
            {
                ++count;
            }
            return count;
        }
        else
        {
            let count = 0;
            for (const item of this)
            {
                if (predicate(item))
                {
                    ++count;
                }
            }
            return count;
        }
    }

    defaultIfEmpty(defaultValue: T): IEnumerable<T>
    {
        return new DefaultIfEmptyEnumerable(this, defaultValue);
    }

    distinct(): IEnumerable<T>
    {
        return new DistinctEnumerable(this);
    }

    elementAt(index: number): T
    {
        if (index < 0) throw new EnumerableError(errorOutOfIndex);
        let i = 0;
        for (const item of this)
        {
            if (i === index)
            {
                return item;
            }
            ++i;
        }
        throw new EnumerableError(errorOutOfIndex);
    }

    elementAtOrNull(index: number): T | null
    {
        if (index < 0) return null;
        let i = 0;
        for (const item of this)
        {
            if (i === index)
            {
                return item;
            }
            ++i;
        }
        return null;
    }

    except(second: Iterable<T>): IEnumerable<T>
    {
        return new ExceptEnumerable(this, second);
    }

    first(predicate?: (item : T) => boolean): T
    {
        if (predicate === undefined)
        {
            const iteratorResult = this[Symbol.iterator]().next();
            if (iteratorResult.done !== true)
            {
                return iteratorResult.value;
            }
            else
            {
                throw new EnumerableError(errorNoElements);
            }
        }
        else
        {
            for (const item of this)
            {
                if (predicate(item))
                {
                    return item;
                }
            }
            throw new EnumerableError(errorNoMatch);
        }
    }

    firstOrNull(predicate?: (item : T) => boolean): T | null
    {
        if (predicate === undefined)
        {
            const iteratorResult = this[Symbol.iterator]().next();
            return iteratorResult.done !== true ? iteratorResult.value : null;
        }
        else
        {
            for (const item of this)
            {
                if (predicate(item))
                {
                    return item;
                }
            }
            return null;
        }
    }

    groupBy<K, E, R>(keySelector: (item: T) => K, elementSelector: (item: T) => E, resultSelector: (key: K, items: IEnumerable<E>) => R): IEnumerable<R>;
    groupBy<K, E>(keySelector: (item: T) => K, elementSelector: (item: T) => E): IEnumerable<IGrouping<K, E>>;
    groupBy<K, R>(keySelector: (item: T) => K, resultSelector: (key: K, items: IEnumerable<T>) => R): IEnumerable<R>;
    groupBy<K>(keySelector: (item: T) => K): IEnumerable<IGrouping<K, T>>;
    groupBy<K, E, R>(
        keySelector: (item: T) => K,
        selector1?: ((item: T) => E) | ((key: K, items: IEnumerable<T>) => R),
        selector2?: (key: K, items: IEnumerable<E>) => R
    ): IEnumerable<R> | IEnumerable<IGrouping<K, E>> | IEnumerable<IGrouping<K, T>>
    {
        if (selector1 === undefined)
        {
            // without elementSelector, without resultSelector
            return new GroupByEnumerable(this, keySelector);
        }
        else if (selector2 !== undefined)
        {
            // with elementSelector, with resultSelector
            const elementSelector = selector1 as (item: T) => E;
            const resultSelector = selector2;
            return new GroupByResultEnumerable(this, keySelector, elementSelector, resultSelector);
        }
        else if (selector1.length === 2)
        {
            // without elementSelector, with resultSelector
            const resultSelector = selector1 as (key: K, items: IEnumerable<T>) => R;
            return new GroupByResultEnumerable(this, keySelector, null, resultSelector);
        }
        else
        {
            // with elementSelector, without resultSelector
            const elementSelector = selector1 as (item: T) => E;
            return new GroupByElementEnumerable(this, keySelector, elementSelector);
        }
    }
    
    groupJoin<I, K, R>(inner: Iterable<I>, outerKeySelector: (item: T) => K, innerKeySelector: (item: I) => K, resultSelector: (outer: T, innerItems: IEnumerable<I>) => R): IEnumerable<R>
    {
        return new GroupJoinEnumerable(this, inner, outerKeySelector, innerKeySelector, resultSelector);
    }

    intersect(second: Iterable<T>): IEnumerable<T>
    {
        return new IntersectEnumerable(this, second);
    }

    join<I, K, R>(inner: Iterable<I>, outerKeySelector: (item: T) => K, innerKeySelector: (item: I) => K, resultSelector: (outer: T, inner: I) => R): IEnumerable<R>
    {
        return new JoinEnumerable(this, inner, outerKeySelector, innerKeySelector, resultSelector);
    }

    last(predicate?: (item : T) => boolean): T
    {
        if (predicate === undefined)
        {
            let result: T | null = null;
            // When type 'T' is a union type that contains 'null', 'result' is possibly 'null'
            // even if there is an item passing the test, so a flag is needed.
            let isFound = false;
            for (const item of this)
            {
                isFound = true;
                result = item;
            }
            if (isFound)
            {
                return result!;
            }
            else
            {
                throw new EnumerableError(errorNoElements);
            }
        }
        else
        {
            let result: T | null = null;
            // When type 'T' is a union type that contains 'null', 'result' is possibly 'null'
            // even if there is an item passing the test, so a flag is needed.
            let isFound = false;
            for (const item of this)
            {
                if (predicate(item))
                {
                    isFound = true;
                    result = item;
                }
            }
            if (isFound)
            {
                return result!;
            }
            else
            {
                throw new EnumerableError(errorNoMatch);
            }
        }
    }

    lastOrNull(predicate?: (item : T) => boolean): T | null
    {
        if (predicate === undefined)
        {
            let result: T | null = null;
            for (const item of this)
            {
                result = item;
            }
            return result;
        }
        else
        {
            let result: T | null = null;
            for (const item of this)
            {
                if (predicate(item))
                {
                    result = item;
                }
            }
            return result;
        }
    }

    max(selector: (item: T) => number): number
    {
        const iterator = this[Symbol.iterator]();
        let iteratorResult = iterator.next();
        if (iteratorResult.done === true) throw new EnumerableError(errorNoElements);
        let max = selector(iteratorResult.value);
        while (true)
        {
            iteratorResult = iterator.next();
            if (iteratorResult.done === true) return max;
            const value = selector(iteratorResult.value);
            max = value > max ? value : max;
        }
    }

    min(selector: (item: T) => number): number
    {
        const iterator = this[Symbol.iterator]();
        let iteratorResult = iterator.next();
        if (iteratorResult.done === true) throw new EnumerableError(errorNoElements);
        let min = selector(iteratorResult.value);
        while (true)
        {
            iteratorResult = iterator.next();
            if (iteratorResult.done === true) return min;
            const value = selector(iteratorResult.value);
            min = value < min ? value : min;
        }
    }

    ofType<U extends T>(typePredicate: (item: T) => item is U): IEnumerable<U>
    {
        return new OfTypeEnumerable(this, typePredicate);
    }

    orderBy<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>
    {
        return new OrderedEnumerable(this, keySelector, comparer, false);
    }

    orderByDescending<K>(keySelector: (item :T) => K, comparer?: Comparer<K>): IOrderedEnumerable<T>
    {
        return new OrderedEnumerable(this, keySelector, comparer, true);
    }

    prepend(item: T): IEnumerable<T>
    {
        return new PrependEnumerable(this, item);
    }

    reverse(): IEnumerable<T>
    {
        return new ReverseEnumerable(this);
    }

    select<U>(selector: (item: T, index: number) => U): IEnumerable<U>
    {
        return new WhereSelectEnumerable(this, () => true, selector);
    }

    selectMany<U, R>(collectionSelector: (item: T, index: number) => Iterable<U>, resultSelector: (item: T, collectionItem: U) => R): IEnumerable<R>;
    selectMany<R>(selector: (item: T, index: number) => Iterable<R>): IEnumerable<R>;
    selectMany<U, R>(selector1: ((item: T, index: number) => Iterable<U>) | ((item: T, index: number) => Iterable<R>), selector2?: (item: T, collectionItem: U) => R): IEnumerable<R>
    {
        if (selector2 === undefined)
        {
            const selector = selector1 as (item: T, index: number) => Iterable<R>;
            return new SelectManyEnumerable(this, selector);
        }
        else
        {
            const collectionSelector = selector1 as (item: T, index: number) => Iterable<U>;
            return new SelectManyResultEnumerable(this, collectionSelector, selector2);
        }
    }
    

    sequenceEqual(second: Iterable<T>): boolean
    {
        const firstIterator = this[Symbol.iterator]();
        const secondIterator = second[Symbol.iterator]();
        while (true)
        {
            const firstResult = firstIterator.next();
            const secondReuslt = secondIterator.next();
            if (firstResult.done === true)
            {
                return secondReuslt.done === true;
            }
            else if (secondReuslt.done === true)
            {
                return false;
            }
            else
            {
                if (firstResult.value !== secondReuslt.value)
                {
                    return false;
                }
            }
        }
    }

    single(predicate?: (item : T) => boolean): T
    {
        if (predicate === undefined)
        {
            const iterator = this[Symbol.iterator]();
            const iteratorResult = iterator.next();
            if (iteratorResult.done === true) throw new EnumerableError(errorNoElements);
            const iteratorResult2 = iterator.next();
            if (iteratorResult2.done === true)
            {
                return iteratorResult2.value;
            }
            throw new EnumerableError(errorMoreThanOneMatch);
        }
        else
        {
            const iterator = this[Symbol.iterator]();
            while (true)
            {
                const iteratorResult = iterator.next();
                if (iteratorResult.done === true) break;
                const value = iteratorResult.value
                if (predicate(value))
                {
                    while (true)
                    {
                        const iteratorResult2 = iterator.next();
                        if (iteratorResult2.done === true)
                        {
                            return value;
                        }
                        if (predicate(iteratorResult2.value))
                        {
                            throw new EnumerableError(errorMoreThanOneMatch);
                        }
                    }
                }
            }
            throw new EnumerableError(errorNoMatch);
        }
    }

    singleOrNull(predicate?: (item : T) => boolean): T | null
    {
        if (predicate === undefined)
        {
            const iterator = this[Symbol.iterator]();
            const iteratorResult = iterator.next();
            if (iteratorResult.done === true) return null;
            const iteratorResult2 = iterator.next();
            return iteratorResult2.done ? iteratorResult2.value : null;
        }
        else
        {
            let previousItem: T | null = null;
            for (const item of this)
            {
                if (predicate(item))
                {
                    if (previousItem === null)
                    {
                        previousItem = item;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            return previousItem;
        }
    }

    skip(count: number): IEnumerable<T>
    {
        return new PartialEnumerable(this, count > 0 ? count : 0, null);
    }

    skipWhile(predicate: (item: T) => boolean): IEnumerable<T>
    {
        return new SkipWhileEnumerable(this, predicate);
    }

    sum(selector: (item: T) => number): number
    {
        let sum = 0;
        for (const item of this)
        {
            sum += selector(item);
        }
        return sum;
    }

    take(count: number): IEnumerable<T>
    {
        return new PartialEnumerable(this, 0, count > 0 ? count : 0);
    }

    takeWhile(predicate: (item: T) => boolean): IEnumerable<T>
    {
        return new TakeWhileEnumerable(this, predicate);
    }

    toArray(): T[]
    {
        return [...this];
    }

    toMap<K, U>(keySelector: (item: T) => K, elementSelector: (item: T) => U): Map<K, U>;
    toMap<K>(keySelector: (item: T) => K): Map<K, T>;
    toMap<K, U>(keySelector: (item: T) => K, elementSelector?: (item: T) => U): Map<K, U> | Map<K, T>
    {
        if (elementSelector !== undefined)
        {
            const map = new Map<K, U>();
            for (const item of this)
            {
                map.set(keySelector(item), elementSelector(item));
            }
            return map;
        }
        else
        {
            const map = new Map<K, T>();
            for (const item of this)
            {
                map.set(keySelector(item), item);
            }
            return map;
        }
    }

    union(second: Iterable<T>): IEnumerable<T>
    {
        return new UnionEnumerable(this, second);
    }

    where(predicate: (item: T) => boolean): IEnumerable<T>
    {
        return new WhereEnumerable(this, predicate);
    }

    zip<U, R>(second: Iterable<U>, resultSelector: (firstItem: T, secondItem: U) => R): IEnumerable<R>;
    zip<U>(second: Iterable<U>): IEnumerable<[T, U]>;
    zip<U, R>(second: Iterable<U>, resultSelector?: (firstItem: T, secondItem: U) => R): IEnumerable<R> | IEnumerable<[T, U]>
    {
        return resultSelector == null ? new ZipEnumerable(this, second, (firstItem: T, secondItem: U): [T, U] => [firstItem, secondItem])
            : new ZipEnumerable(this, second, resultSelector);
    }
}
