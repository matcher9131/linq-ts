import { enumerable } from "../src/mod.ts";
import { assertStrictEquals, assertNotStrictEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";

Deno.test("count", () => {
    assertStrictEquals(
        enumerable([] as number[]).count(),
        0
    );

    assertStrictEquals(
        enumerable([] as number[]).count(n => n > 0),
        0
    );

    assertStrictEquals(
        enumerable([1, 5, 8]).count(),
        3
    );

    assertStrictEquals(
        enumerable([1, 5, 8]).count(n => n % 2 === 0),
        1
    );

    assertStrictEquals(
        enumerable([1, 5, 8]).count(n => n > 10),
        0
    );

    assertStrictEquals(
        enumerable([
            { foo: "foo" },
            { foo: "bar" },
            { foo: "baz" }
        ]).count(
            o => o.foo.startsWith("b")
        ),
        2
    );

    assertNotStrictEquals(
        enumerable([
            { foo: "foo" },
            { foo: "bar" },
            { foo: "baz" }
        ]).count(
            o => o.foo.startsWith("f")
        ),
        2
    );
});