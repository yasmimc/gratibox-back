import bcrypt from "bcrypt";
import { dataAlredyExists } from "../helpers/databaseHelpers.js";
import * as userRepository from "../repositories/userRepository.js";

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

export { createUser };
