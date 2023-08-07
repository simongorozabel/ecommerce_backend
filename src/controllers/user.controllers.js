const catchError = require("../utils/catchError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const Purchase = require("../models/Purchase");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll({ include: [Cart, Purchase] });
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id, { include: [Cart, Purchase] });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone } = req.body;
  const result = await User.update(
    {
      firstName,
      lastName,
      phone,
    },
    {
      where: { id },
      returning: true,
    }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email /* ,isVerified:true */ } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET);

  return res.status(201).json({ user, token });
});

const getLoggedUser = catchError(async (req, res) => {
  const user = req.user;
  const id = user.id;
  const result = await User.findByPk(id, { include: [Cart] });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  getLoggedUser,
};
