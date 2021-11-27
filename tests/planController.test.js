import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import connection from "../src/database/connection.js";
import * as usersRepository from "../src/repositories/usersRepository.js";
import * as sessionsRepository from "../src/repositories/sessionsRepository.js";

describe("GET /plans", () => {
    let token;
    beforeAll(async () => {
        const mockUser = createUser();
        const user = await usersRepository.create(mockUser);
        const mockSession = createSession(user.id);
        await sessionsRepository.create({
            userId: user.id,
            token: mockSession.token,
        });
        token = mockSession.token;
    });

    it("should return 200 and plans array", async () => {
        const result = await supertest(app)
            .get("/plans")
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
