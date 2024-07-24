import { Barang } from "@prisma/client";

export type createBarangRequest = {
  namaBarang: string;
  tipeBarang?: string;
  stokBarang: number;
};

export type updateBarangRequest = {
  namaBarang?: string;
  tipeBarang?: string;
  stokBarang?: number;
};

export const toBarangResponse = (barang: Barang) => {
  return {
    id: barang.id,
    namaBarang: barang.namaBarang,
    tipeBarang: barang.tipeBarang,
    stokBarang: barang.stokBarang,
  };
};
