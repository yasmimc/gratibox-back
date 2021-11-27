import { signatureSchema } from "../database/validations/schemas.js";
import * as signatureService from "../services/signatureService.js";

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
        return res.sendStatus(400);
    }

    const signedPlan = await signatureService.signPlan({
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
        return res.sendStatus(500);
    }

    res.status(201).send(signedPlan);
}

async function getUserPlan(req, res) {
    const { token } = req.locals;
    const userPlan = await signatureService.getPlan({ token });
    if (!userPlan) {
        return res.sendStatus(500);
    }
    if (!userPlan.id) {
        return res.sendStatus(404);
    }
    res.send(userPlan);
}

export { signPlan, getUserPlan };
