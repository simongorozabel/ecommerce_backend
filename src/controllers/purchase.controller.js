const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Image = require("../models/Image");

const getAll = catchError(async (req, res) => {
  const results = await Purchase.findAll({
    include: [
      {
        model: Product,
        include: [Image],
      },
    ],
    where: { userId: req.user.id },
  });
  return res.json(results);
});

// const create = catchError(async (req, res) => {
//   const id = req.user.id;

//   const cart = await Cart.findAll({
//     include: [Product],
//     where: { userId: id },
//   });

//   const result = cart.map(async ({ productId, quantity }) => {
//     await Purchase.create({
//       productId,
//       quantity,
//       userId: id,
//     });
//   });

//   await Cart.destroy({ where: { userId: id } });

//   return res.status(201).json(result);
// });

/*
Otra versión que no es de mi lógica para el post:
*/
const create = catchError(async (req, res) => {
  const productsCart = await Cart.findAll({
    where: { userId: req.user.id },
    attributes: ["quantity", "userId", "productId"],
    raw: true,
  });
  const purchases = await Purchase.bulkCreate(productsCart);
  await Cart.destroy({ where: { userId: req.user.id } });
  return res.status(201).json(purchases);
});

module.exports = {
  getAll,
  create,
};
