import faker from "faker";
import { v4 as uuid } from "uuid";
import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import * as sessionsRepository from "../src/repositories/sessionsRepository.js";
import * as usersRepository from "../src/repositories/usersRepository.js";
import * as userService from "../src/services/userService.js";

describe("POST /sign-up", () => {
    let user;

    beforeAll(async () => {
        user = createUser();
    });

    it("returns 201 for new user with valid params", async () => {
        const result = await supertest(app).post("/sign-up").send(user);
        const status = result.status;

        expect(status).toEqual(201);
    });

    it("returns 400 for invalid user params", async () => {
        const body = { ...user };
        delete body.email;

        const result = await supertest(app).post("/sign-up").send(body);
        const status = result.status;

        expect(status).toEqual(400);
    });

    it("returns 409 for existent user", async () => {
        const mockUser = createUser();
        const newUser = await usersRepository.create(mockUser);
        const result = await supertest(app).post("/sign-up").send(newUser);
        const status = result.status;

        expect(status).toEqual(409);
    });
});

describe("POST /sign-in", () => {
    let mockUser;
    beforeAll(async () => {
        mockUser = createUser();
        await userService.createUser(mockUser);
    });

    beforeEach(async () => {
        await connection.query("DELETE FROM sessions");
    });

    it("returns 200 for successful sign in", async () => {
        const body = {
            email: mockUser.email,
            password: mockUser.password,
        };

        const result = await supertest(app).post("/sign-in").send(body);
        const status = result.status;
        const resp = result.body;

        expect(status).toEqual(200);
        expect(resp).toHaveProperty("token");
        expect(resp).toHaveProperty("user");
    });

    it("returns 400 for invalid user params", async () => {
        const body = {
            name: mockUser.name,
            password: mockUser.password,
        };

        const result = await supertest(app).post("/sign-in").send(body);
        const status = result.status;

        expect(status).toEqual(400);
    });

    it("returns 404 for non existent user", async () => {
        const nonExistentUser = createUser();

        const body = {
            email: nonExistentUser.email,
            password: nonExistentUser.password,
        };

        const result = await supertest(app).post("/sign-in").send(body);
        const status = result.status;

        expect(status).toEqual(404);
    });

    it("returns 401 for incorrect password", async () => {
        const body = {
            email: mockUser.email,
            password: faker.internet.password(),
        };

        const result = await supertest(app).post("/sign-in").send(body);
        const status = result.status;

        expect(status).toEqual(401);
    });
});

describe("DELETE /session", () => {
    let user;
    let token;
    beforeAll(async () => {
        const mockUser = createUser();
        const result = await userService.createUser(mockUser);
        user = result.user;
        const mockSession = createSession(user.id);
        await sessionsRepository.create({
            userId: user.id,
            token: mockSession.token,
        });
        token = mockSession.token;
    });

    afterEach(async () => {
        await connection.query("DELETE FROM sessions");
    });

    it("should set session as expired and return 200", async () => {
        const result = await supertest(app)
            .delete("/session")
            .set({ Authorization: `Bearer ${token}` });
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("should return 404 when session is expired", async () => {
        await sessionsRepository.create({
            userId: user.id,
            token,
        });
        await supertest(app)
            .delete("/session")
            .set({ Authorization: `Bearer ${token}` });
        const result = await supertest(app)
            .delete("/session")
            .set({ Authorization: `Bearer ${token}` });
        const status = result.status;

        expect(status).toEqual(404);
    });
});

describe("GET /auth", () => {
    it("return 200 when session exists and is active", async () => {
        const mockUser = createUser();
        const user = await usersRepository.create(mockUser);
        const mockSession = createSession(user.id);
        await sessionsRepository.create({
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
