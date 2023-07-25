import { enumerable } from "../src/mod.ts";
import { assertEquals, assertNotStrictEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";

Deno.test("concat", () => {
    assertEquals(
        [...enumerable([1, 5, 8]).concat([2, -1, 0])],
        [1, 5, 8, 2, -1, 0]
    );

    assertEquals(
        [...enumerable([] as number[]).concat([2, -1, 0])],
        [2, -1, 0]
    );

    assertEquals(
        [...enumerable([1, 5, 8]).concat([] as number[])],
        [1, 5, 8]
    );

    const arr = [1, 5, 8];
    assertNotStrictEquals(
        [...enumerable(arr).concat([] as number[])],
        arr
    );
});