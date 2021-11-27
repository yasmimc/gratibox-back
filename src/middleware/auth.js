import * as userController from "../controllers/userController.js";

export default async function auth(req, res, next) {
    const session = await userController.validateUserToken(req, res);
    if (session.token) {
        req.locals = { token: session.token };
        next();
    }
}
