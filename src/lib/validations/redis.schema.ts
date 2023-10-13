import { z } from "zod";

export const SetRedisSchema = z.object({
  key: z.string({ required_error: "Key is required" }),
  value: z.string({ required_error: "Value is required" }),
  secondsToken: z.literal("EX"),
  seconds: z.number({ required_error: "Seconds is required" }),
});

export type SetRedisInput = z.infer<typeof SetRedisSchema>;
