const {
  getAll,
  create,

  remove,
  update,
} = require("../controllers/cart.controllers");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const cartRouter = express.Router();

cartRouter.use(verifyJWT);

cartRouter.route("/").get(getAll).post(create);

cartRouter.route("/:id").delete(remove).put(update);

module.exports = cartRouter;
