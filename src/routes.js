import { Router } from "express";
import { signUp, signIn } from "./controllers/usersController.js";

const routes = Router();

routes.post("/sign-up", signUp);
routes.post("/sign-in", signIn);

export default routes;
