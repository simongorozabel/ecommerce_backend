const app = require("../app");
const request = require("supertest");
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

test("should GET/products", async () => {
  const res = await request(app).get("/products");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("should POST/products", async () => {
  const product = {
    title: "Smart Tv",
    brand: "Samsung",
    description: "Description",
    price: 100,
    categoryId: 1,
  };
  const res = await request(app)
    .post("/products")
    .send(product)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body.name).toBe(product.name);
  expect(res.body.id).toBeDefined();
});

test("should PUT/products/:id", async () => {
  const products = {
    brand: "Apple",
  };
  const res = await request(app)
    .put(`/products/${id}`)
    .send(products)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body.brand).toBe(products.brand);
});

test("should DELETE/products/:id", async () => {
  const res = await request(app)
    .delete(`/products/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});

// test("should POST/products/:id/images", async () => {
//   const image = await Image.create({
//     url: "cualquiercosa.com",
//     publicId: "ungato",
//   });
//   const res = await request(app)
//     .post(`/products/${id}/images`)
//     .send([image.id])
//     .set("Authorization", `Bearer ${token}`);
//   await image.destroy();
//   expect(res.status).toBe(200);
//   expect(res.body).toHaveLength(1);
// });
