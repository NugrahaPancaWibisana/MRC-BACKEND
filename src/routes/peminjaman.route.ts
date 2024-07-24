import { Hono } from "hono";
import { PeminjamanController } from "../controllers/peminjaman.controller";

const app = new Hono();

app.post("/", ...PeminjamanController.CreatePeminjaman);
app.get("/:RFID", ...PeminjamanController.GetRiwayat);
app.delete("/", ...PeminjamanController.DeletePeminjaman);
app.get("/", ...PeminjamanController.GetAllRiwayat);

export default app;
