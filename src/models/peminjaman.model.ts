import { Peminjaman } from "@prisma/client";

export type createPeminjamanRequest = {
  RFID: string;
  namaBarang: string;
  jumlahBarang: number;
  tipeBarang?: string;
  keterangan?: string;
  lamaPinjam: number;
  tanggalPinjam: string;
};

export type deletePeminjamanRequest = {
  RFID: string;
  namaBarang: string;
}

export type getRiwayat = {
  RFID: string;
}

export function toPeminjamanResponse(peminjaman: Peminjaman) {
  return {
    RFID: peminjaman.RFID,
    namaBarang: peminjaman.namaBarang,
    jumlahBarang: peminjaman.jumlahBarang,
    tipeBarang: peminjaman.tipeBarang,
    keterangan: peminjaman.keterangan,
    lamaPinjam: peminjaman.lamaPinjam,
    tanggalPinjam: peminjaman.tanggalPinjam,
  };
}