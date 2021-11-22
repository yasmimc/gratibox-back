import connection from "../database/connection.js";

async function getProducts(req, res) {
    try {
        const result = await connection.query(`SELECT * FROM products;`);
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export { getProducts };
