import faker from "faker";

export function createUser() {
    const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: "123qweASD@",
    };

    return user;
}
