import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/connection.js";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import * as sessionRepository from "../src/repositories/sessionRepository.js";

describe("POST /sign-up", () => {
    let mockUser;

    beforeAll(async () => {
        /*createUser takes an optional parameter (dontSave) that says 
		whether user data should not be saved to the database*/
        mockUser = await createUser(true);
    });

    it("returns 201 for new user with valid params", async () => {
        const result = await supertest(app).post("/sign-up").send(mockUser);
        const status = result.status;

        expect(status).toEqual(201);
    });

    it("returns 400 for invalid user params", async () => {
        const body = { ...mockUser };
        delete body.email;

        const result = await supertest(app).post("/sign-up").send(body);
        const status = result.status;

        expect(status).toEqual(400);
    });

    it("returns 409 for existent user", async () => {
        const newUser = await createUser();
        const result = await supertest(app).post("/sign-up").send(newUser);
        const status = result.status;

        expect(status).toEqual(409);
    });
});

describe("POST /sign-in", () => {
    let mockUser;
    beforeAll(async () => {
        mockUser = await createUser();
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
        //createUser takes an optional parameter (dontSave) that says
        //whether user data should not be saved to the database
        const nonExistentUser = await createUser(true);

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
            password: "123qweASD",
        };

        const result = await supertest(app).post("/sign-in").send(body);
        const status = result.status;

        expect(status).toEqual(401);
    });
});

describe("DELETE /session", () => {
    let session;
    let mockUser;
    beforeAll(async () => {
        /*createUser takes an optional parameter (dontSave) that says
		whether user data should not be saved to the database*/
        mockUser = await createUser();
        session = await createSession(mockUser.id);
    });

    afterEach(async () => {
        await connection.query("DELETE FROM sessions");
    });

    it("should set session as expired and return 200", async () => {
        const result = await supertest(app)
            .delete("/session")
            .set({ Authorization: `Bearer ${session.token}` });
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("should return 404 when session is expired", async () => {
        await sessionRepository.create({
            userId: mockUser.id,
            token: session.token,
        });
        await supertest(app)
            .delete("/session")
            .set({ Authorization: `Bearer ${session.token}` });
        const result = await supertest(app)
            .delete("/session")
            .set({ Authorization: `Bearer ${session.token}` });
        const status = result.status;

        expect(status).toEqual(404);
    });
});

afterAll(async () => {
    await connection.query("DELETE FROM sessions");
    await connection.query("DELETE FROM users");
});

afterAll(async () => {
    connection.end();
});
