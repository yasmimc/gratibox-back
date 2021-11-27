import faker from "faker";
import connection from "../../src/database/connection.js";
import bcrypt from "bcrypt";
import RandExp from "randexp";
import { strongPasswordRegex } from "../../src/database/validations/regex.js";

export function createUser() {
    const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: new RandExp(strongPasswordRegex).gen(),
    };

    return user;
}
