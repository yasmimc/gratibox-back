import * as productsRepository from "../repositories/productsRepository.js";

async function getProducts() {
    return await productsRepository.getProducts();
}

export { getProducts };
