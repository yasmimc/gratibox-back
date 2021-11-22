import { Router } from "express";
import { signUp, signIn } from "./controllers/usersController.js";
import { getPlans } from "./controllers/plansController.js";
import { sendOk } from "./helpers/responses.js";
import auth from "./middleware/auth.js";
import { getUserPlan, signPlan } from "./controllers/signatureController.js";
import { getProducts } from "./controllers/productsController.js";

const routes = Router();

routes.post("/sign-up", signUp);
routes.post("/sign-in", signIn);
routes.get("/auth", auth, sendOk);
routes.get("/plans", auth, getPlans);
routes.get("/products", auth, getProducts);
routes.post("/signature", auth, signPlan);
routes.get("/signature", auth, getUserPlan);

export default routes;
