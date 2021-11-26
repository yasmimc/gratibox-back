import connection from "../database/connection.js";
import { signatureSchema } from "../database/validations/schemas.js";
import * as signaturesService from "../services/signaturesService.js";

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

    const signedPlan = await signaturesService.signPlan({
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

    if (!signedPlan) {
        res.sendStatus(500);
    }

    res.status(201).send(signedPlan);
}

async function getUserPlan(req, res) {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
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
