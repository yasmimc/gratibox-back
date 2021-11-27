import * as productService from "../services/productService.js";

async function getProducts(req, res) {
    const products = await productService.getProducts();
    if (!products) {
        return res.sendStatus(500);
    }
    res.send(products);
}

export { getProducts };
