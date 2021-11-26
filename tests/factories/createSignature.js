import faker from "faker";

function createSignature(userId) {
    let cep = "";

    while (cep.length < 8) {
        cep += parseInt(Math.random() * 10, 10);
    }

    return {
        userId,
        cep,
        city: faker.address.cityName(),
        deliveryAddress: `${faker.address.streetName()}, ${faker.address.streetAddress()}`,
        plan: "7",
        products: [("7", "9")],
        startDate: faker.date.future(),
        state: faker.address.stateAbbr(),
        userFullName: faker.name.findName(),
        date: new Date(),
    };
}

export { createSignature };
