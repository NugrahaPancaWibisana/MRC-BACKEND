import { Hono } from "hono";
import { UserController } from "../controllers/user.controller";

const app = new Hono();

app.post("/register", ...UserController.CreateUser);
app.post("/login", ...UserController.Login);
app.get("/", ...UserController.GetAllUsers);
app.get("/:RFID", ...UserController.GetUser);
app.patch("/", ...UserController.UpdateUser);
app.delete("/:RFID", ...UserController.DeleteUser);
app.delete("/logout", ...UserController.Logout);

export default app;
