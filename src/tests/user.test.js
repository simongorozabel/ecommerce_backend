const app = require("../app");
const request = require("supertest");
require("../models");

let id;
let token;

test("should LOGIN/users/login", async () => {
  const res = await request(app).post("/users/login").send({
    email: "testuser@gmail.com",
    password: "testuser",
  });
  token = res.body.token;

  expect(res.status).toBe(201);
});

test("should GET/users", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  console.log(res.body);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("should POST/users", async () => {
  const user = {
    firstName: "Simon",
    lastName: "Gorozabel",
    email: "simom.gorozabel@gmail.com",
    password: "123",
    phone: "+593968032994",
  };
  const res = await request(app)
    .post("/users")
    .send(user)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(user.name);
});

test("should PUT/users/id", async () => {
  const user = {
    firstName: "Lorenzo",
    lastName: "Medici",
  };
  const res = await request(app)
    .put(`/users/${id}`)
    .send(user)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(user.firstName);
  expect(res.body.lastName).toBe(user.lastName);
});

test("should DELETE/users/:id", async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
