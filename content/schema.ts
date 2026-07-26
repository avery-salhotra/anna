import { z } from "zod";

const requiredTrimmedString = z.string().trim().min(1);

export const profileSchema = z.strictObject({
  name: requiredTrimmedString,
  introduction: requiredTrimmedString,
  email: z.string().trim().min(1).pipe(z.email()),
});

export type Profile = z.infer<typeof profileSchema>;
