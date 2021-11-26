import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import connection from "../src/database/connection.js";

describe("GET /products", () => {
    let token;
    beforeAll(async () => {
        const user = await createUser();
        const session = await createSession(user.id);
        token = session.token;
    });

    it("should return 200 and products array", async () => {
        const result = await supertest(app)
            .get("/products")
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(200);
        expect(Array.isArray(result.body)).toBeTruthy();
    });
});

afterAll(async () => {
    await connection.query("DELETE FROM sessions");
    await connection.query("DELETE FROM users");
});

afterAll(async () => {
    connection.end();
});
