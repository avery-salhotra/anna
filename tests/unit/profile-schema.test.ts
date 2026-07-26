import { describe, expect, it } from "vitest";
import { profileSchema } from "@/content/schema";

const validProfile = {
  name: "Anna Salhotra",
  introduction: "Product designer.",
  email: "anna@example.com",
};

describe("profileSchema", () => {
  it("accepts and returns a complete profile", () => {
    expect(profileSchema.parse(validProfile)).toEqual(validProfile);
  });

  it("trims surrounding whitespace from each profile string", () => {
    expect(
      profileSchema.parse({
        name: "  Anna Salhotra  ",
        introduction: "\n Product designer. \t",
        email: "  anna@example.com  ",
      }),
    ).toEqual(validProfile);
  });

  it("preserves meaningful internal profile content", () => {
    expect(
      profileSchema.parse({
        name: "Anna  Salhotra",
        introduction: "Product  designer.",
        email: "Anna+Portfolio@Example.COM",
      }),
    ).toEqual({
      name: "Anna  Salhotra",
      introduction: "Product  designer.",
      email: "Anna+Portfolio@Example.COM",
    });
  });

  it.each([
    ["missing name", { introduction: validProfile.introduction, email: validProfile.email }],
    ["empty name", { ...validProfile, name: "" }],
    ["whitespace-only name", { ...validProfile, name: " \n\t " }],
    ["missing introduction", { name: validProfile.name, email: validProfile.email }],
    ["empty introduction", { ...validProfile, introduction: "" }],
    ["whitespace-only introduction", { ...validProfile, introduction: " \n\t " }],
    ["both missing", { email: validProfile.email }],
    ["both empty", { ...validProfile, name: "", introduction: "" }],
    [
      "both whitespace-only",
      { ...validProfile, name: " \t ", introduction: " \n " },
    ],
  ])("rejects a profile with %s", (_case, profile) => {
    expect(profileSchema.safeParse(profile).success).toBe(false);
  });

  it.each([
    ["missing email", { name: validProfile.name, introduction: validProfile.introduction }],
    ["empty email", { ...validProfile, email: "" }],
    ["whitespace-only email", { ...validProfile, email: " \n\t " }],
    ["no local part", { ...validProfile, email: "@example.com" }],
    ["no domain", { ...validProfile, email: "anna@" }],
    ["no at sign", { ...validProfile, email: "anna.example.com" }],
    ["internal whitespace", { ...validProfile, email: "anna @example.com" }],
    ["malformed syntax", { ...validProfile, email: "anna@example..com" }],
  ])("rejects a profile with %s", (_case, profile) => {
    expect(profileSchema.safeParse(profile).success).toBe(false);
  });

  it.each([
    ["name", { ...validProfile, name: 42 }],
    ["introduction", { ...validProfile, introduction: true }],
    ["email", { ...validProfile, email: ["anna@example.com"] }],
  ])("rejects a non-string %s", (_field, profile) => {
    expect(profileSchema.safeParse(profile).success).toBe(false);
  });

  it("rejects unexpected profile fields", () => {
    expect(
      profileSchema.safeParse({
        ...validProfile,
        providerMetadata: "must not leak into the content contract",
      }).success,
    ).toBe(false);
  });

  it("accepts long nonblank profile text while no length limit is defined", () => {
    const longName = "A".repeat(10_000);
    const longIntroduction = "B".repeat(100_000);

    expect(
      profileSchema.parse({
        ...validProfile,
        name: longName,
        introduction: longIntroduction,
      }),
    ).toMatchObject({
      name: longName,
      introduction: longIntroduction,
    });
  });
});
