import connection from "../database/connection.js";

async function create({ deliveryAddress, cep, city, state, userFullName }) {
    try {
        const result = await connection.query(
            `INSERT INTO delivery_info (address, cep, city, state, user_fullname) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`,
            [deliveryAddress, cep, city, state, userFullName]
        );

        return result.rows[0];
    } catch (error) {
        console.log("deliveryInfoRepository.create ERROR");
        console.log(error);
    }
}

export { create };
