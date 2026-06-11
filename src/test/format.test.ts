import { describe, expect, it } from "vitest";
import { formatDelta, formatINR } from "@/lib/format";

describe("formatINR", () => {
  it("uses INR and Indian digit grouping", () => {
    expect(formatINR(123456.78)).toContain("₹1,23,456.78");
    expect(formatINR(12500000, true)).toBe("₹1.25Cr");
  });
});

describe("formatDelta", () => {
  it("formats positive and negative changes", () => {
    expect(formatDelta(110, 100).text).toContain("+10.0%");
    expect(formatDelta(90, 100).positive).toBe(false);
    expect(formatDelta(null, 100).text).toBe("—");
  });
});
