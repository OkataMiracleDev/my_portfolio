import { describe, expect, it } from "vitest";
import { validateAmount, isFreeOrder } from "../pricing";

describe("validateAmount", () => {
  const fixedPlugin = { priceAmount: 5000, pwywEnabled: false };
  const pwywPlugin = { priceAmount: 5000, pwywEnabled: true };

  it("accepts an amount matching the fixed price", () => {
    expect(validateAmount(fixedPlugin, 5000)).toEqual({ ok: true });
  });

  it("rejects an amount that doesn't match the fixed price", () => {
    expect(validateAmount(fixedPlugin, 4000)).toEqual({
      ok: false,
      error: "amount must equal 5000",
    });
  });

  it("accepts ₦0 when pay-what-you-want is enabled", () => {
    expect(validateAmount(pwywPlugin, 0)).toEqual({ ok: true });
  });

  it("accepts any non-negative amount when pay-what-you-want is enabled", () => {
    expect(validateAmount(pwywPlugin, 12000)).toEqual({ ok: true });
  });

  it("rejects a negative amount even when pay-what-you-want is enabled", () => {
    expect(validateAmount(pwywPlugin, -1)).toEqual({
      ok: false,
      error: "amount cannot be negative",
    });
  });

  it("rejects a non-integer amount", () => {
    expect(validateAmount(pwywPlugin, 49.99)).toEqual({
      ok: false,
      error: "amount must be a whole number",
    });
  });
});

/**
 * validateAmount has always accepted ₦0 for a pay-what-you-want plugin
 * (see above) -- the order then went to Paystack anyway, which refuses a
 * zero-amount charge with "Invalid Amount Sent". This predicate is what
 * routes those orders around Paystack instead, so the boundary matters.
 */
describe("isFreeOrder", () => {
  it("treats ₦0 as free", () => {
    expect(isFreeOrder(0)).toBe(true);
  });

  it("treats the smallest real charge as not free", () => {
    expect(isFreeOrder(1)).toBe(false);
  });

  it("treats a normal price as not free", () => {
    expect(isFreeOrder(1000)).toBe(false);
  });

  it("agrees with validateAmount on a pwyw plugin priced at ₦0 by the buyer", () => {
    const plugin = { priceAmount: 1000, pwywEnabled: true };
    expect(validateAmount(plugin, 0)).toEqual({ ok: true });
    expect(isFreeOrder(0)).toBe(true);
  });

  it("covers a plugin whose list price is ₦0 with pwyw off", () => {
    const plugin = { priceAmount: 0, pwywEnabled: false };
    expect(validateAmount(plugin, 0)).toEqual({ ok: true });
    expect(isFreeOrder(0)).toBe(true);
  });
});
