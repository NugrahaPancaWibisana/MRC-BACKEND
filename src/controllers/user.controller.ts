import { createFactory } from "hono/factory";
import { DB } from "../app/database";
import { UserValidation } from "../validations/user.validation";
import { v4 as uuid } from "uuid";
import { Validation } from "../validations/validation";
import { ZodError } from "zod";
import {
  createUserRequest,
  loginUserRequest,
  toUserResponse,
  updateUserRequest,
} from "../models/user.model";
import { Auth } from "../middlewares/auth.middleware";

const factory = createFactory();

function formatZodError(error: ZodError) {
  return error.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
}

export class UserController {
  static CreateUser = factory.createHandlers(async (c) => {
    try {
      const req: createUserRequest = (await c.req.json()) as createUserRequest;
      const userRequest = Validation.validate(UserValidation.REGISTER, req);

      const userExist = await DB.user.count({
        where: {
          RFID: userRequest.RFID,
        },
      });

      if (userExist != 0) {
        return c.json({ message: "User sudah ada" }, 400);
      }

      const user = await DB.user.create({
        data: userRequest,
      });

      return c.json({ data: toUserResponse(user) }, 200);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = formatZodError(error);
        return c.json({ errors: formattedError }, 400);
      }

      return c.json({ errors: error }, 500);
    }
  });

  static Login = factory.createHandlers(async (c) => {
    try {
      const req: loginUserRequest = (await c.req.json()) as loginUserRequest;
      const userRequest = Validation.validate(UserValidation.LOGIN, req);

      let user = await DB.user.findUnique({
        where: {
          RFID: userRequest.RFID,
        },
      });

      if (!user) {
        return c.json({ errors: "RFID tidak ditemukan atau salah" }, 400);
      }

      if (user.token !== null) {
        return c.json({ errors: "User sudah login" }, 400);
      }

      user = await DB.user.update({
        where: {
          RFID: userRequest.RFID,
        },
        data: {
          token: uuid(),
        },
      });

      const res = toUserResponse(user);
      res.token = user.token!;
      return c.json({ data: res }, 200);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = formatZodError(error);
        return c.json({ errors: formattedError }, 400);
      }

      return c.json({ errors: error }, 500);
    }
  });

  static GetAllUsers = factory.createHandlers(
    Auth.authentication,
    async (c) => {
      const users = await DB.user.findMany();

      return c.json({ data: users }, 200);
    }
  );

  static GetUser = factory.createHandlers(Auth.authentication, async (c) => {
    const req = c.req.param("RFID");

    const user = await DB.user.findUnique({
      where: {
        RFID: req,
      },
    });

    if (!user) {
      return c.json({ errors: "User tidak ditemukan atau salah" }, 400);
    }

    return c.json({ data: toUserResponse(user) }, 200);
  });

  static UpdateUser = factory.createHandlers(Auth.authentication, async (c) => {
    try {
      const req: updateUserRequest = (await c.req.json()) as updateUserRequest;
      const userRequest = Validation.validate(UserValidation.UPDATE, req);

      const user: updateUserRequest = {};

      if (userRequest.RFID) {
        user.RFID = userRequest.RFID;
      }

      if (userRequest.name) {
        user.name = userRequest.name;
      }

      if (userRequest.role) {
        user.role = userRequest.role;
      }

      const updatedUser = await DB.user.update({
        where: {
          RFID: req.RFID,
        },
        data: user,
      });

      return c.json({ data: toUserResponse(updatedUser) }, 200);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = formatZodError(error);
        return c.json({ errors: formattedError }, 400);
      }

      return c.json({ errors: error }, 500);
    }
  });

  static DeleteUser = factory.createHandlers(Auth.authentication, async (c) => {
    const req = c.req.param("RFID");

    const user = await DB.user.delete({
      where: {
        RFID: req,
      },
    });

    return c.json({ data: toUserResponse(user) }, 200);
  });

  static Logout = factory.createHandlers(Auth.authentication, async (c) => {
    const req: loginUserRequest = (await c.req.json()) as loginUserRequest;
    const userRequest = Validation.validate(UserValidation.LOGIN, req);

    const user = await DB.user.update({
      where: {
        RFID: userRequest.RFID,
      },
      data: {
        token: null,
      },
    });

    return c.json(
      {
        message: "Logout user telah berhasil dilakukan",
        data: toUserResponse(user),
      },
      200
    );
  });
}
