import * as deliveryInfoRepository from "../repositories/deliveryInfoRepository.js";
import * as subscriptionsRepository from "../repositories/subscriptionsRepository.js";
import * as productsRepository from "../repositories/productsRepository.js";

async function signPlan({
    deliveryAddress,
    cep,
    city,
    state,
    userFullName,
    userId,
    plan,
    startDate,
    products,
}) {
    try {
        const deliveryInfo = await deliveryInfoRepository.create({
            deliveryAddress,
            cep,
            city,
            state,
            userFullName,
        });

        const subscription = await subscriptionsRepository.create({
            userId,
            plan,
            startDate,
            deliveryInfoId: deliveryInfo.id,
        });

        await productsRepository.signProducts({ products, subscription });

        return {
            subscriptionId: subscription.id,
            userId,
            plan,
            cep,
            city,
            deliveryAddress,
            products,
            startDate,
            state,
            userFullName,
            date: subscription.date,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getPlan({ token }) {
    const subscription = await subscriptionsRepository.getSubscriptionByToken({
        token,
    });
    if (!subscription) {
        return null;
    }
    const subscriptionProducts =
        await subscriptionsRepository.getSubscriptionProducts({
            subscription,
        });
    if (!subscriptionProducts) {
        return null;
    }
    subscription.products = [];
    subscriptionProducts.forEach((product) => {
        subscription.products.push(product.name);
    });

    return subscription;
}

export { signPlan, getPlan };
