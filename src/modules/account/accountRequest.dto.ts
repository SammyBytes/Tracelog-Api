import { z } from "zod";

export const AccountRequestSchema = z.object({
  name: z.string(),
  type: z.enum(["user", "organization"]),
  url: z.url().optional(),
});
