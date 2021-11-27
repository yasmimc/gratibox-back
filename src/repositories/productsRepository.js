import connection from "../database/connection.js";

async function signProducts({ products, subscription }) {
    /* construct INSERT products query dinamically */
    const insertProducts = [];
    let preparedQuery = "";
    products.forEach((product, index) => {
        insertProducts.push(subscription.id, product);
        preparedQuery += `($${(index + 1) * 2 - 1}, $${(index + 1) * 2})`;

        if (products.length > 1 && index + 1 < products.length)
            preparedQuery += ", ";
    });

    try {
        await connection.query(
            `INSERT INTO subscription_products (subscription_id, product_id) VALUES ${preparedQuery}`,
            insertProducts
        );
    } catch (error) {
        console.log("signProducts ERROR");
        console.log(error);
    }
}

async function getProducts() {
    try {
        const result = await connection.query(`SELECT * FROM products;`);
        return result.rows;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export { signProducts, getProducts };
