import * as planService from "../services/planService.js";

async function getPlans(req, res) {
    const plans = await planService.getPlans();
    if (!plans) {
        return res.status(500);
    }
    res.send(plans);
}

export { getPlans };
