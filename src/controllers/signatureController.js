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
    const { token } = req.locals;
    const userPlan = await signaturesService.getPlan({ token });
    if (!userPlan) {
        res.sendStatus(500);
    }
    if (!userPlan.id) {
        res.sendStatus(404);
    }
    res.send(userPlan);
}

export { signPlan, getUserPlan };
