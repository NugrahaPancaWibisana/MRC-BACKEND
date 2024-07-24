import { User } from "@prisma/client";

export type createUserRequest = {
  RFID?: string;
  name: string;
  role?: string;
  token: string;
};

export type loginUserRequest = {
  RFID: string;
}

export type updateUserRequest = {
  RFID?: string;
  name?: string;
  role?: string;
};

export type deleteUserRequest = {
  RFID: string;
};

export type getUserRequest = {
  RFID: string;
};

export const toUserResponse = (user: User) => {
  return {
    RFID: user.RFID,
    name: user.name,
    role: user.role,
    token: user.token,
  };
};
