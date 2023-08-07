const app = require("../app");
const request = require("supertest");
const Product = require("../models/Product");
require("../models");

let token;
let id;

beforeAll(async () => {
  const res = await request(app).post("/users/login").send({
    email: "testuser@gmail.com",
    password: "testuser",
  });
  token = res.body.token;
});

test("should GET/cart", async () => {
  const res = await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("should POST/cart", async () => {
  const product = await Product.create({
    title: "Samsung Smart TV",
    description: "Good quality",
    brand: "Samsung",
    price: 120,
    categoryId: 1,
  });
  const cart = {
    productId: product.id,
    quantity: 2,
  };
  const res = await request(app)
    .post("/cart")
    .send(cart)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.quantity).toBe(cart.quantity);
  expect(res.body.id).toBeDefined();
});

test("should PUT/cart/:id", async () => {
  const cart = {
    quantity: 1,
  };
  const res = await request(app)
    .put(`/cart/${id}`)
    .send(cart)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(cart.quantity);
});

test("should DELETE/cart/:id", async () => {
  const res = await request(app)
    .delete(`/cart/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
