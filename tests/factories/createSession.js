import connection from "../../src/database/connection.js";
import { v4 as uuid } from "uuid";

export async function createSession(userId) {
    const session = {
        token: uuid(),
        user_id: userId,
    };

    const sessionCreated = await connection.query(
        `INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *`,
        [session.user_id, session.token]
    );

    if (sessionCreated.rows.length) {
        session.id = sessionCreated.rows[0].id;
        return session;
    }
    console.log("Error factory createSession");
    return null;
}
