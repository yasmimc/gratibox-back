import faker from "faker";
import connection from "../../src/database/connection.js";
import bcrypt from "bcrypt";
import RandExp from "randexp";
import { strongPasswordRegex } from "../../src/database/validations/regex.js";

/*createUser takes an optional parameter (dontSave) that says 
whether user data should not be saved to the database*/
export async function createUser(dontSave) {
    const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: new RandExp(strongPasswordRegex).gen(),
    };

    if (dontSave) {
        user.id = faker.datatype.number();
        return user;
    }

    const encryptedPassword = bcrypt.hashSync(user.password, 10);

    let newUser;

    newUser = await connection.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
        [user.name, user.email, encryptedPassword]
    );

    if (newUser.rowCount) {
        user.id = newUser.rows[0].id;
        return user;
    }
    console.log("Error factory createUser");
    return null;
}
