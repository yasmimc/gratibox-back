import { v4 as uuid } from "uuid";

export function createSession(userId) {
    const session = {
        token: uuid(),
        user_id: userId,
    };
    return session;
}
