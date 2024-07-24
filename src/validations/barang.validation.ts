import { z, ZodType } from "zod";

export class BarangValidation {
  static readonly CREATE: ZodType = z.object({
    namaBarang: z.string().min(1).max(100),
    tipeBarang: z.string().min(1).optional(),
    stokBarang: z.number(),
  });

  static readonly UPDATE: ZodType = z.object({
    namaBarang: z.string().min(1).max(100).optional(),
    stokBarang: z.number().optional(),
  });
}
