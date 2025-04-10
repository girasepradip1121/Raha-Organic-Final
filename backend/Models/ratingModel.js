const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db');

const Rating = Sequelize.define('Rating', {
    ratingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "product",
            key: 'productId'
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            name: 'user_product_unique',
            fields: ['userId', 'productId'] 
        }
    ]
});

module.exports=Rating
