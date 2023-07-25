import type { IEnumerable } from "./enumerable/_ienumerable.ts";
import { Enumerable } from "./_internal.ts";
import { errorNegativeArgument } from "./error/_error_message.ts";

export function empty<T>(): IEnumerable<T>
{
    return new Enumerable<T>([]);
}

export function enumerable<T>(source: Iterable<T>): IEnumerable<T>
{
    return new Enumerable(source);
}

export function range(start: number, count: number): IEnumerable<number>
{
    if (count < 0) throw new Error(errorNegativeArgument("count"));
    const gen = function*() {
        for (let i = 0; i < count; ++i)
        {
            yield start + i;
        }
    }
    return new Enumerable(gen());
}

export function repeat<T>(element: T, count: number): IEnumerable<T>
{
    if (count < 0) throw new Error(errorNegativeArgument("count"));
    const gen = function*() {
        for (let i = 0; i < count; ++i)
        {
            yield element;
        }
    }
    return new Enumerable(gen());
}