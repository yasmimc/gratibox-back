import { Router } from "express";
import { signUp, signIn } from "./controllers/usersController.js";
import { getPlans } from "./controllers/plansController.js";
import { sendOk } from "./helpers/responses.js";
import auth from "./middleware/auth.js";

const routes = Router();

routes.post("/sign-up", signUp);
routes.post("/sign-in", signIn);
routes.get("/auth", auth, sendOk);
routes.get("/plans", auth, getPlans);

export default routes;
