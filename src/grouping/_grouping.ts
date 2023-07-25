import type { IEnumerable } from "../enumerable/_ienumerable.ts";
import type { IGrouping } from "./_igrouping.ts";
import { Enumerable } from "../_internal.ts";

export class Grouping<K, T> extends Enumerable<T> implements IGrouping<K, T>
{
    constructor(
        readonly key: K,
        source: IEnumerable<T>
    )
    {
        super(source);
    }
}