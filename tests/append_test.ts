import { enumerable } from "../src/mod.ts";
import { assertEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";

Deno.test("append", () => {
    assertEquals(
        [...enumerable([1, 5, 3]).append(1)],
        [1, 5, 3, 1]
    );
    
    assertEquals(
        [...enumerable([] as string[]).append("foo")],
        ["foo"]
    );
});