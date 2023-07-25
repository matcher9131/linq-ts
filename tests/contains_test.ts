import { enumerable } from "../src/mod.ts";
import { assertStrictEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";

Deno.test("contains", () => {
    assertStrictEquals(
        enumerable([1, 2, 3]).contains(1),
        true
    );

    assertStrictEquals(
        enumerable([1, 2, 3]).contains(0),
        false
    );

    assertStrictEquals(
        enumerable([
            { foo: "foo" },
            { foo: "bar" },
            { foo: "baz" }
        ]).contains(
            { foo: "foo" },
            (x, y) => x.foo === y.foo
        ),
        true
    );

    assertStrictEquals(
        enumerable([
            { foo: "foo" },
            { foo: "bar" },
            { foo: "baz" }
        ]).contains(
            { foo: "" },
            (x, y) => x.foo === y.foo
        ),
        false
    );

    const foo = { foo: "foo" };
    assertStrictEquals(
        enumerable([
            foo,
            { foo: "bar" },
            { foo: "baz" }
        ]).contains(
            foo
        ),
        true
    );

    assertStrictEquals(
        enumerable([
            { foo: "foo" },
            { foo: "bar" },
            { foo: "baz" }
        ]).contains(
            { foo: "foo" }
        ),
        false
    );

    assertStrictEquals(
        enumerable([
            [0, 1],
            [2],
            [3, 4, 5]
        ]).contains(
            [3, 4, 5],
            (x, y) => {
                if (x.length !== y.length) return false;
                for (let i = 0; i < x.length; ++i)
                {
                    if (x[i] !== y[i]) return false;
                }
                return true;
            }
        ),
        true
    );

    assertStrictEquals(
        enumerable([
            [0, 1],
            [2],
            [3, 4, 5]
        ]).contains(
            [3, 4, 0],
            (x, y) => {
                if (x.length !== y.length) return false;
                for (let i = 0; i < x.length; ++i)
                {
                    if (x[i] !== y[i]) return false;
                }
                return true;
            }
        ),
        false
    );

    assertStrictEquals(
        enumerable([
            [0, 1],
            [2],
            [3, 4, 5]
        ]).contains(
            [3, 4, 5]
        ),
        false
    );

    const arr = [3, 4, 5];
    assertStrictEquals(
        enumerable([
            [0, 1],
            [2],
            arr
        ]).contains(
            arr
        ),
        true
    );
});