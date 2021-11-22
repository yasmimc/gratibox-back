import "../setup.js";
import connection from "../database/connection.js";

console.log("creating plans...");
const plans = await connection.query(
    `INSERT INTO plans (name, period) VALUES ('Mensal', 30), ('Semanal', 7);`
);
console.log("creating producst...");
const products = await connection.query(
    `INSERT INTO products (name) VALUES ('Chás'), ('Insensos'), ('Produtos orgânicos');`
);
connection.end();
console.log("Done !");
