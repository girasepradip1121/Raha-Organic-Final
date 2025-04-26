const {DataTypes}=require('sequelize')
const Sequelize=require('../config/db')
const Product=Sequelize.define('product',{
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discountLabel: {
        type: DataTypes.STRING,
        defaultValue:null
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    originalPrice: {
        type: DataTypes.FLOAT,
        defaultValue:null
    },
    description: {
        type: DataTypes.STRING,
        defaultValue:null
    },
    size:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:"category",
            key:"categoryId"
        }
    },
    averageRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0 // Default 0
    },
    totalRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0 // Kitne logon ne rate kiya
    },
    
}, { 
    tableName:"product",
    timestamps: true 
    }
);

module.exports = Product;
