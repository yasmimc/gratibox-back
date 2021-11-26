import connection from "../database/connection.js";

async function signProducts({ products, signature }) {
    /* construct INSERT products query dinamically */
    const insertProducts = [];
    let preparedQuery = "";
    products.forEach((product, index) => {
        insertProducts.push(signature.id, product);
        preparedQuery += `($${(index + 1) * 2 - 1}, $${(index + 1) * 2})`;

        if (products.length > 1 && index + 1 < products.length)
            preparedQuery += ", ";
    });

    try {
        await connection.query(
            `INSERT INTO signature_products (signature_id, product_id) VALUES ${preparedQuery}`,
            insertProducts
        );
    } catch (error) {
        console.log("signProducts ERROR");
        console.log(error);
    }
}

export { signProducts };
