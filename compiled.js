/** @jsx h */
function h(type, props, ...children) {
    return { type, props, children };
}

const a = h(
    "ul",
    { className: "list" },
    h(
        "li",
        null,
        "item 1"
    ),
    h(
        "li",
        null,
        "item 2"
    )
);

console.log(a);
