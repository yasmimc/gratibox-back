import connection from "../database/connection.js";
import { usersSchema } from "../database/validations/schemas.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { dataAlredyExists } from "../helpers/databaseHelpers.js";

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

	if (await dataAlredyExists("users", "email", email)) {
		res.sendStatus(409);
		return;
	}

	try {
		const encryptedPassword = bcrypt.hashSync(password, 10);

		connection.query(
			`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
			[name, email, encryptedPassword]
		);
		res.sendStatus(201);
	} catch (error) {
		console.log(error.message);
		res.send(500);
	}
}

async function signIn(req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		res.sendStatus(400);
		return;
	}

	const user = await dataAlredyExists("users", "email", email);

	if (!user) {
		res.sendStatus(404);
		return;
	}

	if (!bcrypt.compareSync(password, user.password)) {
		res.sendStatus(401);
		return;
	}

	try {
		const token = uuid();

		connection.query(`INSERT INTO sessions (user_id, token) VALUES ($1, $2)`, [
			user.id,
			token,
		]);

		delete user.password;
		res.status(200).send({ token, user });
	} catch (error) {
		console.log(error.message);
		res.send(500);
	}
}

export { signUp, signIn };
