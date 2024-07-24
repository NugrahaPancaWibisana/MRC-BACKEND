import { Hono } from "hono";
import UserRoutes from "./routes/user.route";
import BarangRoutes from "./routes/barang.route";
import PeminjamanRoutes from "./routes/peminjaman.route";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello MRC!");
});

app.route("/api/users", UserRoutes);
app.route("/api/barang", BarangRoutes);
app.route("/api/peminjaman", PeminjamanRoutes);

export default app;
