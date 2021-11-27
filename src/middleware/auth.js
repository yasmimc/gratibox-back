import * as usersController from "../controllers/usersController.js";

export default async function auth(req, res, next) {
    const session = await usersController.validateUserToken(req, res);
    if (session.token) {
        req.locals = { token: session.token };
        next();
    }
}
