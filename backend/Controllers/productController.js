const Product = require("../Models/productModel");
const Image = require("../Models/imageModel");
const OrderItem = require("../Models/orderItemModel");
const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const { fn, col, literal } = require("sequelize");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      discountLabel,
      price,
      originalPrice,
      description,
      size,
      categoryId,
    } = req.body;

    const newProduct = await Product.create({
      name,
      discountLabel,
      price,
      originalPrice,
      description,
      size,
      categoryId,
    });

    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls.push(...req.files.map((file) => `${file.filename}`));
    }
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        await Image.create({ productId: newProduct.productId, imageUrl });
      })
    );
    console.log("Product Created");

    res
      .status(201)
      .json({ message: "Product created successfully!", product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Image,
          attributes: ["imageUrl"], // Sirf imageUrl fetch karega
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Products ka format adjust karna
    const formattedProducts = products.map((product) => {
      return {
        ...product.toJSON(),
        images: product.images ? product.images.map((img) => img.imageUrl) : [], // Direct array of image URLs
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.log("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId, {
      include: [{ model: Image, attributes: ["imageUrl"] }],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Format the product to include an array of image URLs
    const formattedProduct = {
      ...product.toJSON(),
      images: product.images ? product.images.map((img) => img.imageUrl) : [],
    };

    res.status(200).json(formattedProduct);
  } catch (error) {
    console.log("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const images = await Image.findAll({ where: { productId } });

    images.forEach((img) => {
      const imagePath = path.join("uploads", path.basename(img.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Image.destroy({ where: { productId } });
    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("Request Body:", req.body);

    const {
      name,
      discountLabel,
      price,
      originalPrice,
      description,
      size,
      categoryId,
    } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.update({
      name,
      discountLabel,
      price,
      originalPrice,
      description,
      size,
      categoryId,
    });
    // If new images are uploaded, delete old images and save new ones
    if (req.files && req.files.length > 0) {
      const oldImages = await Image.findAll({ where: { productId } });

      oldImages.forEach((img) => {
        const imagePath = path.join("uploads", path.basename(img.imageUrl));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await Image.destroy({ where: { productId } });

      const imageUrls = req.files.map((file) => `${file.filename}`);
      await Promise.all(
        imageUrls.map(async (imageUrl) => {
          await Image.create({ productId, imageUrl });
        })
      );
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating product", error });
  }
};

const { Op } = require("sequelize");

const recommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const recommendedProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        productId: { [Op.ne]: productId },
      },
      order: [["createdAt", "DESC"]],

      include: [
        {
          model: Image,
          attributes: ["imageUrl"],
        },
      ],
    });
    const formattedProducts = recommendedProducts.map((prod) => ({
      ...prod.toJSON(),
      images: prod.images ? prod.images.map((img) => img.imageUrl) : [],
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ error: "Error fetching recommended products" });
  }
};

const getBestSellingProducts = async (req, res) => {
  try {
    // Step 1: Find top-selling product IDs
    const bestSellers = await OrderItem.findAll({
      attributes: ["productId", [fn("SUM", col("quantity")), "totalSold"]],
      group: ["productId"],
      order: [[literal("totalSold"), "DESC"]],
      limit: 6,
      raw: true,
    });

    const productIds = bestSellers.map((item) => item.productId);
    // Step 2: Fetch full product details with images
    const products = await Product.findAll({
      where: {
        productId: {
          [Op.in]: productIds,
        },
      },
      include: [
        {
          model: Image,
          attributes: ["imageId", "imageUrl"],
        },
      ],
    });

    // Step 3: Attach totalSold to each product
    const result = bestSellers
      .map((bestSeller) => {
        const product = products.find(
          (p) => p.productId === bestSeller.productId
        );
        if (!product) return null;

        return {
          productId: product.productId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discountLabel: product.discountLabel,
          description: product.description,
          size: product.size,
          categoryId: product.categoryId,
          averageRating: product.averageRating,
          totalRatings: product.totalRatings,
          images: product.images,
          totalSold: parseInt(bestSeller.totalSold),
        };
      })
      .filter(Boolean); // remove nulls if any

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching best-selling products:", error);
    res
      .status(500)
      .json({ message: "Error fetching best-selling products", error });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  recommendedProducts,
  getBestSellingProducts,
};
