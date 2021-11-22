import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import connection from "../src/database/connection.js";

describe("POST /signature", () => {
    let token;
    let user;
    beforeAll(async () => {
        user = await createUser();
        const session = await createSession(user.id);
        token = session.token;
    });

    it("should return 201 for successful signed Plan", async () => {
        const body = {
            userId: user.id,
            cep: "31035060",
            city: "Abadia dos Dourados",
            deliveryAddress: "Rua São Bento, 300",
            plan: "1",
            products: [("1", "3")],
            startDate: "2021-11-23",
            state: "MG",
            userFullName: "YASMIM CAVALCANTI DE REZENDE",
        };

        console.log({ body });
        const result = await supertest(app)
            .post("/signature")
            .send(body)
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(201);
        expect(result.body).toHaveProperty("signatureId");
        expect(result.body).toHaveProperty("userId");
        expect(result.body).toHaveProperty("plan");
        expect(result.body).toHaveProperty("products");
        expect(result.body).toHaveProperty("startDate");
        expect(result.body).toHaveProperty("userFullName");
        expect(result.body).toHaveProperty("deliveryAddress");
        expect(result.body).toHaveProperty("cep");
        expect(result.body).toHaveProperty("city");
        expect(result.body).toHaveProperty("state");
    });

    it("should return 400 for wrong body sent", async () => {
        const result = await supertest(app)
            .post("/signature")
            .send({})
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(400);
    });
});
afterAll(async () => {
    await connection.query("DELETE FROM signatures");
    await connection.query("DELETE FROM delivery_info");
    await connection.query("DELETE FROM sessions");
    await connection.query("DELETE FROM users");
});

afterAll(async () => {
    connection.end();
});
