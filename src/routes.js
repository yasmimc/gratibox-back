import { Router } from "express";
import auth from "./middleware/auth.js";
import * as userController from "./controllers/userController.js";
import * as plansController from "./controllers/plansController.js";
import * as signatureController from "./controllers/signatureController.js";
import * as productsController from "./controllers/productsController.js";

const routes = Router();

routes.post("/sign-up", userController.signUp);
routes.post("/sign-in", userController.signIn);
routes.get("/auth", auth, userController.authOk);
routes.get("/plans", auth, plansController.getPlans);
routes.get("/products", auth, productsController.getProducts);
routes.post("/signature", auth, signatureController.signPlan);
routes.get("/signature", auth, signatureController.getUserPlan);
routes.delete("/session", auth, userController.logout);

export default routes;
