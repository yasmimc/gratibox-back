import * as plansService from "../services/plansService.js";

async function getPlans(req, res) {
    const plans = await plansService.getPlans();
    if (!plans) {
        return res.status(500);
    }
    res.send(plans);
}

export { getPlans };
