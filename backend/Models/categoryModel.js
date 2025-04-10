const {DataTypes}=require('sequelize')
const Sequelize=require('../config/db')

const Category=Sequelize.define('category',{
    categoryId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: { name: 'unique_category', msg: 'category must be unique' }    
    },
},{tableName:"category",timestamps:true});

module.exports=Category;