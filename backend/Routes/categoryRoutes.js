const express=require('express')
const router=express.Router();
const categoryController=require('../Controllers/categoryController')
const authMiddleware=require('../Middlewares/authMiddleware')

router.post('/create',authMiddleware,categoryController.createCategory)
router.get('/getall',categoryController.getCategory)
router.put('/update/:categoryId',authMiddleware,categoryController.updatecategory)
router.delete('/delete/:categoryId',authMiddleware,categoryController.deleteCategory)

module.exports=router;