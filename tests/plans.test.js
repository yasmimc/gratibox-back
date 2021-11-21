import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import { createUser } from "./factories/createUser.js";
import { createSession } from "./factories/createSession.js";

describe("GET /plans", () => {
    let token;
    beforeAll(async () => {
        const user = await createUser();
        const session = await createSession(user.id);
        token = session.token;
    });

    it("should return 200 and plans array", async () => {
        const result = await supertest(app)
            .get("/plans")
            .set({ Authorization: `Bearer ${token}` });
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty("plans");
    });
});
