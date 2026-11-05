type Node = { type: string; value?: string; children?: Node[]; data?: { hName?: string } };

/**
 * Turns matched `<u>…</u>` pairs into underlined text. Raw HTML stays off everywhere else: Markdown also renders AI
 * feedback, so this only recognises the bare tags and only within one paragraph. Unmatched tags are left as they are.
 */
export function remarkUnderline() {
    return (tree: Node) => wrap(tree);
}

function wrap(parent: Node) {
    const children = parent.children;
    if (!children) return;

    for (let open = 0; open < children.length; open++) {
        if (!isTag(children[open], "<u>")) continue;
        const close = children.findIndex((n, i) => i > open && isTag(n, "</u>"));
        if (close === -1) break;
        children.splice(open, close - open + 1, {
            type: "underline",
            data: { hName: "u" },
            children: children.slice(open + 1, close),
        });
    }
    children.forEach(wrap);
}

function isTag(node: Node, tag: string) {
    return node.type === "html" && node.value?.trim().toLowerCase() === tag;
}
