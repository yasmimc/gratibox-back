import * as deliveryInfoRepository from "../repositories/deliveryInfoRepository.js";
import * as signaturesRepository from "../repositories/signaturesRepository.js";
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

        const signature = await signaturesRepository.create({
            userId,
            plan,
            startDate,
            deliveryInfoId: deliveryInfo.id,
        });

        await productsRepository.signProducts({ products, signature });

        return {
            signatureId: signature.id,
            userId,
            plan,
            cep,
            city,
            deliveryAddress,
            products,
            startDate,
            state,
            userFullName,
            date: signature.date,
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getPlan({ token }) {
    const signature = await signaturesRepository.getSignatureByToken({ token });
    if (!signature) {
        return null;
    }
    const signatureProducts = await signaturesRepository.getSignatureProducts({
        signature,
    });
    if (!signatureProducts) {
        return null;
    }
    signature.products = [];
    signatureProducts.forEach((product) => {
        signature.products.push(product.name);
    });

    return signature;
}

export { signPlan, getPlan };
