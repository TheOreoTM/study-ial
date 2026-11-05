import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Markdown } from "./markdown";

const render = (text: string) => renderToStaticMarkup(Markdown({ children: text }));

describe("Markdown underline", () => {
    it("underlines text between matched tags", () => {
        expect(render("keep <u>this part</u> marked")).toContain("<u>this part</u>");
    });

    it("keeps formatting inside the underline", () => {
        expect(render("<u>a **b** c</u>")).toContain("<u>a <strong>b</strong> c</u>");
    });

    it("handles more than one pair in a paragraph", () => {
        const html = render("<u>one</u> and <u>two</u>");
        expect(html).toContain("<u>one</u>");
        expect(html).toContain("<u>two</u>");
    });

    it("does not underline an unclosed tag", () => {
        expect(render("<u>never closed")).not.toContain("<u>");
    });

    it("does not let other HTML through", () => {
        const html = render('<u onclick="x()">a</u> <script>alert(1)</script> <img src=x onerror=y>');
        expect(html).not.toContain("<script");
        expect(html).not.toContain("<img");
        expect(html).not.toContain('<u onclick');
    });
});

describe("Markdown direction", () => {
    it("sets Thaana text right to left", () => {
        const html = render("ސުވާލު 1");
        expect(html).toContain('dir="rtl"');
        expect(html).toContain('lang="dv"');
    });

    it("leaves other text alone", () => {
        const html = render("A car accelerates at $2\\,\\text{m s}^{-2}$.");
        expect(html).not.toContain("dir=");
        expect(html).not.toContain("lang=");
    });
});
