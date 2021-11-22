import connection from "../database/connection.js";
import { signatureSchema } from "../database/validations/schemas.js";

async function signPlan(req, res) {
    const {
        userId,
        plan,
        cep,
        city,
        deliveryAddress,
        products,
        startDate,
        state,
        userFullName,
    } = req.body;

    const validation = signatureSchema.validate({
        userId,
        plan,
        cep,
        city,
        deliveryAddress,
        products,
        startDate,
        state,
        userFullName,
    });

    if (validation.error) {
        console.log(
            `${validation.error.details.length} SCHEMA VALIDATION ERRORS FOUND:`
        );
        validation.error.details.forEach((error) => console.log(error.message));
        res.sendStatus(400);
        return;
    }

    try {
        const deliveryInfo = await connection.query(
            `INSERT INTO delivery_info (address, cep, city, state, user_fullname) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`,
            [deliveryAddress, cep, city, state, userFullName]
        );

        const signature = await connection.query(
            `INSERT INTO signatures (user_id, plan_id, start_date, delivery_info) 
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
            [userId, plan, startDate, deliveryInfo.rows[0].id]
        );

        /* construct INSERT products query dinamically */
        const insertProducts = [];
        let preparedQuery = "";
        products.forEach((product, index) => {
            insertProducts.push(signature.rows[0].id, product);
            preparedQuery += `($${(index + 1) * 2 - 1}, $${(index + 1) * 2})`;

            if (products.length > 1 && index + 1 < products.length)
                preparedQuery += ", ";
        });

        await connection.query(
            `INSERT INTO signature_products (signature_id, product_id) VALUES ${preparedQuery}`,
            insertProducts
        );

        res.status(201).send({
            signatureId: signature.rows[0].id,
            userId,
            plan,
            cep,
            city,
            deliveryAddress,
            products,
            startDate,
            state,
            userFullName,
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function getUserPlan(req, res) {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    try {
        const result = await connection.query(
            `SELECT signatures.id,
                    sessions.user_id AS "userId",
                    signatures.start_date AS "startDate",
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

        if (!result.rowCount) return res.sendStatus(404);
        const signature = result.rows[0];

        const signatureProducts = await connection.query(
            `SELECT products.name 
            FROM products
            JOIN signature_products
                ON signature_products.product_id = products.id
            WHERE signature_products.signature_id = $1`,
            [signature.id]
        );

        signature.products = [];
        signatureProducts.rows.forEach((product) => {
            signature.products.push(product.name);
        });

        res.send(signature);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { signPlan, getUserPlan };
