import { usersSchema } from "../database/validations/schemas.js";
import * as userService from "../services/userService.js";

async function signUp(req, res) {
    const { name, email, password } = req.body;

    const validation = usersSchema.validate({
        name,
        email,
        password,
    });

    if (validation.error) {
        console.log(
            `${validation.error.details.length} SCHEMA VALIDATION ERRORS FOUND:`
        );
        validation.error.details.forEach((error) => console.log(error.message));
        res.sendStatus(400);
        return;
    }

    const result = await userService.createUser({ name, email, password });

    if (!result) {
        res.sendStatus(500);
        return;
    }

    if (!result.user) {
        res.sendStatus(409);
        return;
    }

    res.status(201).send(result.user);
}

async function signIn(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.sendStatus(400);
        return;
    }

    const result = await userService.createUserSession({ email, password });

    if (!result) {
        return res.send(500);
    }

    if (!result.user) {
        return res.status(404).send(result.message);
    }
    if (!result.user.id) {
        return res.status(401).send(result.message);
    }

    res.status(200).send({ token: result.token, user: result.user });
}

export { signUp, signIn };
