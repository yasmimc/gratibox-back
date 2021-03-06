import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";
import connection from "../src/database/connection.js";
import { createSubscription } from "./factories/createSubscription.js";
import * as subscriptionService from "../src/services/subscriptionService.js";
import * as usersRepository from "../src/repositories/usersRepository.js";
import * as sessionsRepository from "../src/repositories/sessionsRepository.js";

describe("POST /subscription", () => {
    let token;
    let user;
    beforeAll(async () => {
        const mockUser = createUser();
        user = await usersRepository.create(mockUser);
        const mockSession = createSession(user.id);
        await sessionsRepository.create({
            userId: user.id,
            token: mockSession.token,
        });
        token = mockSession.token;
    });

    it("should return 201 for successful signed Plan", async () => {
        const body = await createSubscription(user.id);

        const result = await supertest(app)
            .post("/subscription")
            .send(body)
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(201);
        expect(result.body).toHaveProperty("subscriptionId");
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
            .post("/subscription")
            .send({})
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(400);
    });
});

describe("GET /subscription", () => {
    let token;
    let user;
    beforeAll(async () => {
        const mockUser = createUser();
        user = await usersRepository.create(mockUser);
        const mockSession = createSession(user.id);
        await sessionsRepository.create({
            userId: user.id,
            token: mockSession.token,
        });
        token = mockSession.token;
    });
    afterEach(async () => {
        await connection.query("DELETE FROM subscription_products");
        await connection.query("DELETE FROM subscriptions");
        await connection.query("DELETE FROM delivery_info");
    });

    it("should return 200 and user plan info when it exists", async () => {
        const body = await createSubscription(user.id);
        await subscriptionService.signPlan(body);
        const result = await supertest(app)
            .get("/subscription")
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty("id");
        expect(result.body).toHaveProperty("userId");
        expect(result.body).toHaveProperty("planId");
        expect(result.body).toHaveProperty("planName");
        expect(result.body).toHaveProperty("planPeriod");
        expect(result.body).toHaveProperty("products");
        expect(result.body).toHaveProperty("startDate");
        expect(result.body).toHaveProperty("userFullName");
        expect(result.body).toHaveProperty("deliveryAddress");
        expect(result.body).toHaveProperty("cep");
        expect(result.body).toHaveProperty("city");
        expect(result.body).toHaveProperty("state");
    });

    it("should return 404 when user dont have a signed plan", async () => {
        const result = await supertest(app)
            .get("/subscription")
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(404);
    });
});

afterAll(async () => {
    await connection.query("DELETE FROM subscription_products");
    await connection.query("DELETE FROM subscriptions");
    await connection.query("DELETE FROM delivery_info");
    await connection.query("DELETE FROM sessions");
    await connection.query("DELETE FROM users");
});

afterAll(async () => {
    connection.end();
});
