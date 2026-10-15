import { describe, it, expect } from "vitest";
import {
  PERSON_ID,
  STUDIO_ID,
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  studioNode,
  websiteNode,
} from "../structured-data";
import { ANIMATE_FAQ } from "../animate-faq";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

describe("studio and person entities", () => {
  it("live on the canonical domain", () => {
    expect(STUDIO_ID.startsWith(SITE_URL)).toBe(true);
    expect(PERSON_ID.startsWith(SITE_URL)).toBe(true);
    expect(JSON.stringify(graph(studioNode(), personNode(), websiteNode()))).not.toContain("okata-miracle");
  });

  it("point at each other by @id instead of redeclaring", () => {
    expect(studioNode().founder).toEqual({ "@id": PERSON_ID });
    expect(personNode().worksFor).toEqual({ "@id": STUDIO_ID });
    expect(websiteNode().publisher).toEqual({ "@id": STUDIO_ID });
  });

  it("place the studio in Port Harcourt, Nigeria", () => {
    expect(studioNode().address).toMatchObject({
      addressLocality: "Port Harcourt",
      addressRegion: "Rivers",
      addressCountry: "NG",
    });
  });

  it("serve Nigeria, Africa and beyond", () => {
    const names = studioNode().areaServed.map((a) => a.name);
    expect(names).toEqual(expect.arrayContaining(["Nigeria", "Africa"]));
  });

  it("carry the new contact address", () => {
    expect(studioNode().email).toBe(CONTACT_EMAIL);
    expect(personNode().email).toBe(CONTACT_EMAIL);
  });

  it("list every service with the studio as provider", () => {
    const offers = studioNode().hasOfferCatalog.itemListElement;
    expect(offers.length).toBeGreaterThanOrEqual(4);
    for (const offer of offers) expect(offer.itemOffered.provider).toEqual({ "@id": STUDIO_ID });
  });
});

describe("faqNode", () => {
  it("mirrors the visible FAQ exactly", () => {
    const node = faqNode(ANIMATE_FAQ);
    expect(node.mainEntity).toHaveLength(ANIMATE_FAQ.length);
    node.mainEntity.forEach((q, i) => {
      expect(q.name).toBe(ANIMATE_FAQ[i].question);
      expect(q.acceptedAnswer.text).toBe(ANIMATE_FAQ[i].answer);
    });
  });

  it("mentions Nigeria and the contact email somewhere a searcher would see them", () => {
    const text = ANIMATE_FAQ.map((f) => f.question + f.answer).join(" ");
    expect(text).toContain("Nigeria");
    expect(text).toContain(CONTACT_EMAIL);
  });
});

describe("breadcrumbNode", () => {
  it("numbers from 1 and uses absolute URLs", () => {
    const node = breadcrumbNode([
      { name: "Okata Studios", path: "/" },
      { name: "Motion design", path: "/animate" },
    ]);
    expect(node.itemListElement[0]).toMatchObject({ position: 1, item: SITE_URL });
    expect(node.itemListElement[1]).toMatchObject({ position: 2, item: `${SITE_URL}/animate` });
  });
});
