import { describe, expect, it } from "vitest";
import { validateAmount } from "../pricing";

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
