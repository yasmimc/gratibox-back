import connection from "../database/connection.js";

async function getPlans() {
    try {
        const result = await connection.query(`SELECT * FROM plans;`);
        return result.rows;
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        return null;
        res.sendStatus(500);
    }
}

export { getPlans };
