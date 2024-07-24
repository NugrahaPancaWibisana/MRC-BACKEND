import { z, ZodType } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    RFID: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    RFID: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    RFID: z.string().min(1).max(100).optional(),
    name: z.string().min(1).max(100).optional(),
  });
}
