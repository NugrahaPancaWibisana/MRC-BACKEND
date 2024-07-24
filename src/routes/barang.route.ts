import { Hono } from 'hono'
import { BarangController } from '../controllers/barang.controller';

const app = new Hono()

app.post("/", ...BarangController.CreateBarang);
app.get("/", ...BarangController.GetAllBarang);
app.get("/:barang", ...BarangController.GetBarang);
app.patch("/", ...BarangController.UpdateBarang);
app.delete("/:barang", ...BarangController.DeleteBarang);

export default app