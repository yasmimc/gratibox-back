import * as plansRepository from "../repositories/plansRepository.js";

async function getPlans() {
    return await plansRepository.getPlans();
}

export { getPlans };
