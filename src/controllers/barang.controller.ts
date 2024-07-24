import { createFactory } from "hono/factory";
import { Auth } from "../middlewares/auth.middleware";
import { ZodError } from "zod";
import {
  createBarangRequest,
  toBarangResponse,
  updateBarangRequest,
} from "../models/barang.model";
import { Validation } from "../validations/validation";
import { BarangValidation } from "../validations/barang.validation";
import { DB } from "../app/database";

const factory = createFactory();

function formatZodError(error: ZodError) {
  return error.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
}

export class BarangController {
  static CreateBarang = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      try {
        const req: createBarangRequest =
          (await c.req.json()) as createBarangRequest;
        const userRequest = Validation.validate(BarangValidation.CREATE, req);

        const barangExist = await DB.barang.count({
          where: {
            namaBarang: userRequest.namaBarang,
          },
        });

        if (barangExist != 0) {
          return c.json({ message: "Barang sudah ada" }, 400);
        }

        const barang = await DB.barang.create({
          data: userRequest,
        });

        return c.json({ data: toBarangResponse(barang) }, 200);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedError = formatZodError(error);
          return c.json({ errors: formattedError }, 400);
        }

        return c.json({ errors: error }, 500);
      }
    }
  );

  static GetAllBarang = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      const barang = await DB.barang.findMany();

      return c.json({ data: barang }, 200);
    }
  );

  static GetBarang = factory.createHandlers(Auth.authentication, async (c) => {
    const namaBarang = c.req.param("barang");

    const barang = await DB.barang.findUnique({
      where: {
        namaBarang,
      },
    });

    if (!barang) {
      return c.json({ errors: "Barang tidak ditemukan atau salah" }, 400);
    }

    return c.json({ data: barang }, 200);
  });

  static UpdateBarang = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      try {
        const req: createBarangRequest =
          (await c.req.json()) as createBarangRequest;
        const userRequest = Validation.validate(BarangValidation.UPDATE, req);

        const user: updateBarangRequest = {};

        if (userRequest.namaBarang) {
          user.namaBarang = userRequest.namaBarang;
        }

        if (userRequest.tipeBarang) {
          user.tipeBarang = userRequest.tipeBarang;
        }

        if (userRequest.stokBarang) {
          user.stokBarang = userRequest.stokBarang;
        }

        const updatedBarang = await DB.barang.update({
          where: {
            namaBarang: req.namaBarang,
          },
          data: user,
        });

        return c.json({ data: toBarangResponse(updatedBarang) }, 200);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedError = formatZodError(error);
          return c.json({ errors: formattedError }, 400);
        }

        return c.json({ errors: error }, 500);
      }
    }
  );

  static DeleteBarang = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      const req = c.req.param("barang");

      const user = await DB.barang.delete({
        where: {
          namaBarang: req,
        },
      });

      return c.json(
        { massage: "Barang berhasil di hapus", data: toBarangResponse(user) },
        200
      );
    }
  );
}
