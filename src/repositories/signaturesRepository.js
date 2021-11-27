import connection from "../database/connection.js";

async function create({ userId, plan, startDate, deliveryInfoId }) {
    try {
        const result = await connection.query(
            `INSERT INTO signatures (user_id, plan_id, start_date, delivery_info) 
                VALUES ($1, $2, $3, $4)
                RETURNING id, date`,
            [userId, plan, startDate, deliveryInfoId]
        );

        return result.rows[0];
    } catch (error) {
        console.log("signaturesRepository.create ERROR");
        console.log(error);
    }
}

async function getSignatureByToken({ token }) {
    try {
        const result = await connection.query(
            `SELECT signatures.id,
                    sessions.user_id AS "userId",
                    signatures.start_date AS "startDate",
                    signatures.date,
                    delivery_info.user_fullname AS "userFullName",
                    delivery_info.address AS "deliveryAddress",
                    delivery_info.cep,
                    delivery_info.city,
                    delivery_info.state,
                    plans.id AS "planId",
                    plans.name AS "planName",
                    plans.period AS "planPeriod"
            FROM sessions
            JOIN signatures 
                ON signatures.user_id = sessions.user_id
            JOIN delivery_info
                ON signatures.delivery_info = delivery_info.id
            JOIN plans
                ON plans.id = signatures.plan_id
            WHERE sessions.token = $1`,
            [token]
        );

        if (!result.rowCount) {
            return {
                message: "User has no signed plan",
                id: null,
            };
        }
        return result.rows[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getSignatureProducts({ signature }) {
    try {
        const result = await connection.query(
            `SELECT products.name 
            FROM products
            JOIN signature_products
                ON signature_products.product_id = products.id
            WHERE signature_products.signature_id = $1`,
            [signature.id]
        );
        return result.rows;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { create, getSignatureByToken, getSignatureProducts };
