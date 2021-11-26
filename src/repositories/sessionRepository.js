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

async function getSessionByToken({ token }) {
    try {
        const result = await connection.query(
            `SELECT * FROM sessions WHERE token = $1 AND is_expired = false`,
            [token]
        );

        if (!result.rows.length)
            return {
                message: "Session not found",
                token: null,
            };
        return result.rows[0];
    } catch (error) {
        console.log("FAIL in authentication");
        console.log(error);
        return null;
    }
}

async function setSessionAsExpired({ token }) {
    try {
        const result = await connection.query(
            `UPDATE sessions
            SET is_expired = true
        WHERE token = $1
        RETURNING *`,
            [token]
        );
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { create, getSessionByToken, setSessionAsExpired };
