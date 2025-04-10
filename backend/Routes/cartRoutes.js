const express=require('express');
const router=express.Router();
const cartController=require('../Controllers/cartController')
const authMiddleware=require('../Middlewares/authMiddleware')

router.post('/add',authMiddleware,cartController.addToCart)
router.get('/getall/:userId',authMiddleware,cartController.getCart)
router.put('/update/:cartId',authMiddleware,cartController.updateCart)
router.delete('/remove/:cartId',authMiddleware,cartController.removeCartItem)

module.exports=router;