import connection from "../database/connection.js";

async function create({ name, email, password }) {
    try {
        const result = await connection.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING*`,
            [name, email, password]
        );
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { create };
