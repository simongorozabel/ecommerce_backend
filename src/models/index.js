const Product = require("./Product");
const Category = require("./Category");

const Cart = require("./Cart");
const User = require("./User");

const Image = require("./Image");

const Purchase = require("./Purchase");

Product.belongsTo(Category);
Category.hasMany(Product);

Image.belongsTo(Product);
Product.hasMany(Image);

Cart.belongsTo(User);
User.hasMany(Cart);

Cart.belongsTo(Product);
Product.hasMany(Cart);

Purchase.belongsTo(User);
User.hasMany(Purchase);

Purchase.belongsTo(Product);
Product.hasMany(Purchase);
