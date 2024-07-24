import { z, ZodType } from "zod";

export class PeminjamanValidation {
  static readonly CREATE: ZodType = z.object({
    RFID: z.string().min(1).max(100),
    namaBarang: z.string().min(1).max(100),
    jumlahBarang: z.number(),
    tipeBarang: z.string().min(1).optional(),
    keterangan: z.string().min(1).optional(),
    lamaPinjam: z.number(),
    tanggalPinjam: z.string(),
  });
}
