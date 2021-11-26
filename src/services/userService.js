import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { validate as uuidValidate } from "uuid";
import { dataAlredyExists } from "../helpers/databaseHelpers.js";
import * as userRepository from "../repositories/userRepository.js";
import * as sessionRepository from "../repositories/sessionRepository.js";

async function createUser({ name, email, password }) {
    if (await dataAlredyExists("users", "email", email)) {
        return {
            user: null,
        };
    }
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const user = await userRepository.create({
        name,
        email,
        password: encryptedPassword,
    });
    if (!user) {
        return null;
    }
    return { user };
}

async function createUserSession({ email, password }) {
    const existentUser = await dataAlredyExists("users", "email", email);

    if (!existentUser) {
        return {
            message: "User not found",
            user: null,
        };
    }

    if (!bcrypt.compareSync(password, existentUser.password)) {
        return {
            message: "Invalid credentials",
            user: {},
        };
    }

    const token = uuid();

    const session = await sessionRepository.create({
        userId: existentUser.id,
        token,
    });

    if (!session) {
        return null;
    }

    delete existentUser.password;
    return { token, user: existentUser };
}

async function validateUserToken({ authorization }) {
    const token = authorization.replace("Bearer ", "");

    if (token.trim() === "") return res.sendStatus(422);
    if (!uuidValidate(token)) return res.sendStatus(400);

    return await sessionRepository.getSessionByToken({ token });
}

export { createUser, createUserSession, validateUserToken };
