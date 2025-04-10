const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");
const upload = require("../Middlewares/uploadMiddleware");
const authMiddleware = require("../Middlewares/authMiddleware");

router.post(
  "/create",
  authMiddleware,
  upload.array("images", 10),
  productController.createProduct
);
router.get("/getall", productController.getAllProducts);
router.get("/getproductbyid/:productId", productController.getProductById);
router.put(
  "/update/:productId",
  authMiddleware,
  upload.array("images", 10),
  productController.updateProduct
);
router.delete(
  "/remove/:productId",
  authMiddleware,
  productController.deleteProduct
);
router.get("/getrecommanded/:productId", productController.recommendedProducts);
router.get("/best-sellers", productController.getBestSellingProducts);

module.exports = router;
