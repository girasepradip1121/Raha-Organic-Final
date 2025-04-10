const express=require('express')
const router=express.Router()
const usercontroller=require('../Controllers/userController')
const authMiddleware = require("../Middlewares/authMiddleware");

router.post('/signup',usercontroller.signup)
router.post('/login',usercontroller.login)
router.post('/logout',usercontroller.logout)
router.get('/getall',authMiddleware,usercontroller.getUsers)

module.exports=router;

