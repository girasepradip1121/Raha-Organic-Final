const {DataTypes}=require('sequelize')
const Sequelize=require('../config/db')

const OrderItem=Sequelize.define("orderItem",{
    orderItemId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    orderId:{
        type:DataTypes.INTEGER,
        defaultValue:null,
        references:{
            model:'order',
            key:'orderId'
        }
    },
    productId:{
        type:DataTypes.INTEGER,
        defaultValue:null,
        references:{
            model:'product',
            key:'productId'
        }
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    totalAmount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
},
{
    tableName:'orderitem',
    timestamps:true
})

module.exports=OrderItem;