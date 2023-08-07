const sequelize = require("../utils/connection");
const request = require("supertest");
const app = require("../app");

const main = async () => {
  try {
    // Acciones a ejecutar antes de los tests
    sequelize.sync();
    const user = {
      email: "testuser@gmail.com",
      password: "testuser",
      firstName: "test",
      lastName: "user",
      phone: "123456789",
    };
    await request(app).post("/users").send(user);

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
