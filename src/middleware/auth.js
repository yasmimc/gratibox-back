import * as userService from "../services/userService.js";

export default async function auth(req, res, next) {
    const { authorization } = req.headers;

    if (
        !authorization ||
        authorization.trim() === "" ||
        !authorization.includes("Bearer ")
    )
        return res.sendStatus(400);

    const session = await userService.validateUserToken({ authorization });

    if (!session) {
        return res.sendStatus(500);
    }
    if (!session.token) {
        return res.sendStatus(404);
    }

    req.locals = { token: session.token };

    next();
}
