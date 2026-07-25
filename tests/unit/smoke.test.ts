import { describe, expect, it } from "vitest";
import { siteName } from "@/lib/site";

describe("test harness", () => {
  it("loads project modules through the @ alias", () => {
    expect(siteName).toBe("Portfolio");
  });
});
