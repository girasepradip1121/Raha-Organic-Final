const sequelize = require('../config/db');
const User=require('./usermodel')
const Category=require('./categoryModel')
const Product=require('./productModel')
const Cart=require('./cartModel')
const Order=require('./orderModel')
const OrderItem=require('./orderItemModel')
const Rating=require('./ratingModel')
const Request=require('./contactUsModel')
const Image=require('./imageModel')

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(Image, { foreignKey: 'productId', onDelete: 'CASCADE' });
Image.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(Rating, { foreignKey: 'productId', onDelete: 'CASCADE' });
Rating.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });


module.exports = {
    User,
    Category,
    Product,
    Image,
    Cart,
    Order,
    OrderItem,
    Rating,
    Request
};

