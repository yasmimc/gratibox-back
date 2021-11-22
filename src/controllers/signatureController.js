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
            `INSERT INTO delivery_info (address, cep, city, state, user_fulllname) 
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

export { signPlan };
