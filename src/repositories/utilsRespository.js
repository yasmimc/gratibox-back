import connection from "../database/connection.js";

async function dataAlredyExists(table, column, value) {
    try {
        const existentData = await connection.query(
            `SELECT * FROM ${table} WHERE ${column} = '${value}' `
        );
        if (existentData.rowCount !== 0) return existentData.rows[0];
        return false;
    } catch (error) {
        console.log("ERROR func dataAlredyExists");
        console.log(error);
        return false;
    }
}

export { dataAlredyExists };
