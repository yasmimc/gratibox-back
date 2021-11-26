import * as productsService from "../services/productsService.js";

async function getProducts(req, res) {
    const products = await productsService.getProducts();
    if (!products) {
        return res.sendStatus(500);
    }
    res.send(products);
}

export { getProducts };
