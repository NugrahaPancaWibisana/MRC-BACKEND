// File path: src/controllers/peminjaman.controller.ts

import { createFactory } from "hono/factory";
import { ZodError } from "zod";
import { Auth } from "../middlewares/auth.middleware";
import {
  createPeminjamanRequest,
  deletePeminjamanRequest,
  toPeminjamanResponse,
} from "../models/peminjaman.model";
import { Validation } from "../validations/validation";
import { PeminjamanValidation } from "../validations/peminjaman.validation";
import { DB } from "../app/database";
import { schedule } from "node-cron";

const factory = createFactory();

function formatZodError(error: ZodError) {
  return error.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
}

const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatCurrentDate() {
  const currentDate = new Date();
  const dayName = days[currentDate.getDay()];
  const date = currentDate.getDate();
  const monthName = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return `${dayName}, ${date}-${monthName}-${year}`;
}

function parseTanggal(tanggal: string): Date {
  const [dayName, dateMonthYear] = tanggal.split(", ");
  const [date, month, year] = dateMonthYear.split("-");
  const monthIndex = months.indexOf(month);
  return new Date(parseInt(year), monthIndex, parseInt(date));
}

export class PeminjamanController {
  static CreatePeminjaman = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      try {
        const req: createPeminjamanRequest =
          (await c.req.json()) as createPeminjamanRequest;
        let userRequest = Validation.validate(PeminjamanValidation.CREATE, req);

        userRequest.tanggalPinjam = formatCurrentDate();

        await DB.barang.update({
          where: {
            namaBarang: userRequest.namaBarang,
          },
          data: {
            stokBarang: {
              decrement: userRequest.jumlahBarang,
            },
          },
        });

        await DB.riwayat.create({
          data: userRequest,
        });

        const Peminjaman = await DB.peminjaman.create({
          data: userRequest,
        });

        return c.json({ data: toPeminjamanResponse(Peminjaman) });
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedError = formatZodError(error);
          return c.json({ errors: formattedError }, 400);
        }

        return c.json({ errors: error }, 500);
      }
    }
  );

  static GetAllRiwayat = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      const riwayat = await DB.riwayat.findMany();

      return c.json({ data: riwayat }, 200);
    }
  );

  static GetRiwayat = factory.createHandlers(Auth.authentication, async (c) => {
    const req = c.req.param("RFID");

    const riwayat = await DB.riwayat.findMany({
      where: {
        RFID: req,
      },
    });

    return c.json({ data: riwayat }, 200);
  });

  static DeletePeminjaman = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      const req: deletePeminjamanRequest =
        (await c.req.json()) as deletePeminjamanRequest;

      await DB.riwayat.update({
        where: {
          RFID: req.RFID,
          AND: {
            namaBarang: req.namaBarang,
          },
        },
        data: {
          status: "SELESAI",
        },
      });

      const peminjaman = await DB.peminjaman.delete({
        where: {
          RFID: req.RFID,
          AND: {
            namaBarang: req.namaBarang,
          },
        },
      });

      await DB.barang.update({
        where: {
          namaBarang: req.namaBarang,
        },
        data: {
          stokBarang: {
            increment: peminjaman.jumlahBarang,
          },
        },
      });

      return c.json({ massage: "SELESAI", data: peminjaman }, 200);
    }
  );

  static async updateExpiredPeminjaman() {
    const today = new Date();

    const peminjamanList = await DB.riwayat.findMany({
      where: {
        status: "SEDANG DI PINJAM",
      },
    });

    for (const peminjaman of peminjamanList) {
      const tanggalPinjam = parseTanggal(peminjaman.tanggalPinjam);
      const tanggalJatuhTempo = new Date(tanggalPinjam);
      tanggalJatuhTempo.setDate(
        tanggalJatuhTempo.getDate() + peminjaman.lamaPinjam
      );

      if (today > tanggalJatuhTempo) {
        await DB.riwayat.update({
          where: { id: peminjaman.id },
          data: { status: "MELEBIHI WAKTU PEMINJAMAN" },
        });
      }
    }
  }
}

// Schedule the job to run every day at midnight
schedule("0 0 * * *", async () => {
  await PeminjamanController.updateExpiredPeminjaman();
});
