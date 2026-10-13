import { describe, it, expect } from "vitest";
import { renderBriefEmail, renderBriefText, fallback } from "../email";

const base = {
  briefLabel: "SaaS ad brief",
  subjectName: "Acme Analytics",
  answers: [
    { question: "Product or company name", answer: "Acme Analytics" },
    { question: "What does it do?", answer: "Tracks churn\nin real time" },
    { question: "Budget", answer: "   " },
  ],
};

describe("renderBriefEmail", () => {
  it("carries the brief's dark palette rather than a white page", () => {
    const html = renderBriefEmail(base);
    expect(html).toContain("#0D0D10");
    expect(html).toContain("#F4F3EF");
    expect(html).toContain('name="color-scheme" content="dark"');
  });

  it("uses tables and inline styles only, since email clients strip the rest", () => {
    const html = renderBriefEmail(base);
    expect(html).toContain("<table");
    expect(html).not.toContain("<style");
    expect(html).not.toContain("class=");
    expect(html).not.toContain("display:flex");
  });

  it("renders every question with its answer", () => {
    const html = renderBriefEmail(base);
    expect(html).toContain("Product or company name");
    expect(html).toContain("What does it do?");
    expect(html).toContain("Q02");
  });

  it("turns newlines in an answer into line breaks", () => {
    expect(renderBriefEmail(base)).toContain("Tracks churn<br>in real time");
  });

  it("marks a blank answer rather than dropping the question", () => {
    const html = renderBriefEmail(base);
    expect(html).toContain("Budget");
    expect(html).toContain("(not given)");
  });

  it("counts only answered questions", () => {
    expect(renderBriefEmail(base)).toContain("2 of 3 answered");
  });

  it("shows the selected package when the brief came from a portal", () => {
    const html = renderBriefEmail({ ...base, selectedPackage: "Value Launch Ad", selectedPrice: "₦200,000" });
    expect(html).toContain("Selected package");
    expect(html).toContain("Value Launch Ad");
    expect(html).toContain("₦200,000");
  });

  it("omits the package block entirely when there is none", () => {
    expect(renderBriefEmail(base)).not.toContain("Selected package");
  });

  it("escapes HTML in client-supplied text", () => {
    const html = renderBriefEmail({
      ...base,
      subjectName: '<img src=x onerror="alert(1)">',
      answers: [{ question: "Q", answer: "<script>bad()</script>" }],
    });
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("<script>bad()");
    expect(html).toContain("&lt;");
  });
});

describe("renderBriefText", () => {
  it("leads with the brief and subject", () => {
    expect(renderBriefText(base)).toContain("SaaS ad brief — Acme Analytics");
  });

  it("names the package when there is one", () => {
    const text = renderBriefText({ ...base, selectedPackage: "Value Launch Ad", selectedPrice: "₦200,000" });
    expect(text).toContain("Selected package: Value Launch Ad (₦200,000)");
  });

  it("keeps blank answers visible", () => {
    expect(renderBriefText(base)).toContain("(not given)");
  });
});

describe("fallback", () => {
  it("passes through real values, trimmed", () => {
    expect(fallback("  hi  ")).toBe("hi");
  });

  it("replaces blanks and non-strings", () => {
    expect(fallback("")).toBe("(not given)");
    expect(fallback("   ")).toBe("(not given)");
    expect(fallback(undefined)).toBe("(not given)");
    expect(fallback(42)).toBe("(not given)");
  });
});
