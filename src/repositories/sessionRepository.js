import connection from "../database/connection.js";

async function create({ userId, token }) {
    try {
        await connection.query(
            `INSERT INTO sessions (user_id, token) VALUES ($1, $2)`,
            [userId, token]
        );

        return 1;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { create };
