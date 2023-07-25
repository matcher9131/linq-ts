import { enumerable } from "../src/mod.ts";
import { assertEquals, assertNotStrictEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";

Deno.test("defaultIfEmpty", () => {
    const t = [...enumerable(["foo", "bar", "baz"]).defaultIfEmpty("No items")];

    assertEquals(
        [...enumerable(["foo", "bar", "baz"]).defaultIfEmpty("No items")],
        ["foo", "bar", "baz"]
    );

    const arr = ["foo", "bar", "baz"];
    assertNotStrictEquals(
        [...enumerable(arr).defaultIfEmpty("No items")],
        arr
    );

    assertEquals(
        [...enumerable([] as string[]).defaultIfEmpty("No items")],
        ["No items"]
    );
});