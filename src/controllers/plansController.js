import connection from "../database/connection.js";

async function getPlans(req, res) {
    try {
        const result = await connection.query(`SELECT * FROM plans;`);
        res.send({ plans: result.rows });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export { getPlans };
