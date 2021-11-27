import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import { v4 as uuid } from "uuid";
import * as userRepository from "../src/repositories/userRepository.js";
import * as sessionRepository from "../src/repositories/sessionRepository.js";

describe("GET /auth", () => {
    it("return 200 when session exists and is active", async () => {
        const mockUser = createUser();
        const user = await userRepository.create(mockUser);
        const mockSession = createSession(user.id);
        await sessionRepository.create({
            userId: user.id,
            token: mockSession.token,
        });
        const result = await supertest(app)
            .get("/auth")
            .set({ Authorization: `Bearer ${mockSession.token}` });
        expect(result.status).toEqual(200);
    });

    it("return 404 when session not exists", async () => {
        const result = await supertest(app)
            .get("/auth")
            .set({ Authorization: `Bearer ${uuid()}` });
        expect(result.status).toEqual(404);
    });

    it("return 400 when authorization dont have token", async () => {
        const result = await supertest(app)
            .get("/auth")
            .set({ Authorization: `Bearer` });
        expect(result.status).toEqual(400);
    });

    it("return 400 when authorization dont have 'Bearer'", async () => {
        const result = await supertest(app)
            .get("/auth")
            .set({ Authorization: uuid() });
        expect(result.status).toEqual(400);
    });
});

afterAll(async () => {
    await connection.query("DELETE FROM sessions");
    await connection.query("DELETE FROM users");
});

afterAll(async () => {
    connection.end();
});
