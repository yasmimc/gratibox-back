import { Router } from "express";
import auth from "./middleware/auth.js";
import * as userController from "./controllers/userController.js";
import * as planController from "./controllers/planController.js";
import * as subscriptionController from "./controllers/subscriptionController.js";
import * as productController from "./controllers/productController.js";

const routes = Router();

routes.post("/sign-up", userController.signUp);
routes.post("/sign-in", userController.signIn);
routes.get("/auth", auth, userController.authOk);
routes.get("/plans", auth, planController.getPlans);
routes.get("/products", auth, productController.getProducts);
routes.post("/subscription", auth, subscriptionController.signPlan);
routes.get("/subscription", auth, subscriptionController.getUserPlan);
routes.delete("/session", auth, userController.logout);

export default routes;
