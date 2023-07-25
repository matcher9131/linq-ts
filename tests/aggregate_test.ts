import { enumerable } from "../src/mod.ts";
import { assertStrictEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";

Deno.test("aggregate", () => {
    const items = enumerable(["Can", "I", "find", "a", "trick", "recalling", "pi", "easily?"]);
    assertStrictEquals(
        items.aggregate(
            (obj, item) =>
                ({
                    sum: obj.sum + item.length,
                    count: obj.count + 1
                }),
            { sum: 0, count: 0 },
            obj => obj.sum / obj.count
        ),
        32 / 8
    );

    assertStrictEquals(
        items.aggregate((s, item) => s + " " + item),
        "Can I find a trick recalling pi easily?"
    );

    assertStrictEquals(
        items.aggregate((sum, item) => sum + item.length, 0),
        32
    );
});