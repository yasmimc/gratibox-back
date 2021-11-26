import connection from "../database/connection.js";

async function create({ userId, plan, startDate, deliveryInfoId }) {
    try {
        const result = await connection.query(
            `INSERT INTO signatures (user_id, plan_id, start_date, delivery_info) 
                VALUES ($1, $2, $3, $4)
                RETURNING id, date`,
            [userId, plan, startDate, deliveryInfoId]
        );

        console.log();

        return result.rows[0];
    } catch (error) {
        console.log("signaturesRepository.create ERROR");
        console.log(error);
    }
}

export { create };
