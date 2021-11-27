import faker from "faker";
import * as productsRepository from "../../src/repositories/productsRepository.js";
import * as plansRepository from "../../src/repositories/plansRepository.js";

async function createSubscription(userId) {
    let cep = "";

    while (cep.length < 8) {
        cep += parseInt(Math.random() * 10, 10);
    }

    const plans = await plansRepository.getPlans();
    const plansIds = plans.map((product) => product.id);
    const randomPlanIndex = parseInt(Math.random() * plans.length, 10);

    const randomPlan = `${plansIds[randomPlanIndex]}`;

    const products = await productsRepository.getProducts();
    const productsIds = products.map((product) => product.id);
    const randomProductsQuantity = parseInt(
        Math.random() * products.length,
        10
    );

    const randomProducts = [];
    for (let i = 0; i <= randomProductsQuantity; i++) {
        const randomId = parseInt(Math.random() * products.length, 10);
        if (
            !randomProducts.find(
                (productId) => productId === productsIds[randomId]
            )
        ) {
            randomProducts.push(productsIds[randomId]);
        }
    }

    return {
        userId,
        cep,
        city: faker.address.cityName(),
        deliveryAddress: `${faker.address.streetName()}, ${faker.address.streetAddress()}`,
        plan: randomPlan,
        products: randomProducts,
        startDate: faker.date.future(),
        state: faker.address.stateAbbr(),
        userFullName: faker.name.findName(),
        date: new Date(),
    };
}

export { createSubscription };
