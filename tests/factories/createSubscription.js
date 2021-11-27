import faker from "faker";

function createSubscription(userId) {
    let cep = "";

    while (cep.length < 8) {
        cep += parseInt(Math.random() * 10, 10);
    }

    return {
        userId,
        cep,
        city: faker.address.cityName(),
        deliveryAddress: `${faker.address.streetName()}, ${faker.address.streetAddress()}`,
        plan: "1",
        products: [("1", "3")],
        startDate: faker.date.future(),
        state: faker.address.stateAbbr(),
        userFullName: faker.name.findName(),
        date: new Date(),
    };
}

export { createSubscription };
