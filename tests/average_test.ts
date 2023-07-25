import { enumerable } from "../src/mod.ts";
import { assertStrictEquals, assertThrows } from "https://deno.land/std@0.195.0/testing/asserts.ts";
import { errorNoElements } from "../src/error/_error_message.ts";
import { EnumerableError } from "../src/error/_enumerable_error.ts";

Deno.test("average", () => {
    assertStrictEquals(
        enumerable(["Can", "I", "find", "a", "trick", "recalling", "pi", "easily?"]).average(s => s.length),
        32 / 8
    );

    assertStrictEquals(
        enumerable([2, 5, 3, 6]).average(n => n),
        4
    );

    assertStrictEquals(
        enumerable([1, 2, 3, 4]).average(n => n * n),
        7.5
    );

    assertThrows(
        () => { enumerable([] as number[]).average(n => n) },
        EnumerableError,
        errorNoElements
    );
});