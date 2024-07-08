const express = require("express");
const ProductController = require("../controllers/ProductController");

const router = express.Router();

// product
router.get("/ProductBrandList", ProductController.ProductBrandList);
router.get("/ProductCategoryList", ProductController.ProductCategoryList);
router.get("/ProductSliderList", ProductController.ProductSliderList);
router.get("/ProductListByBrand/:BrandID", ProductController.ProductListByBrand);
router.get("/ProductListByCategory/:CategoryID", ProductController.ProductListByCategory);
router.get("/ProductListByRemark/:Remark", ProductController.ProductListByRemark);
router.get("/ProductListBySmilier/:CategoryID", ProductController.ProductListBySmilier);
router.get("/ProductListByKeyword/:Keyword", ProductController.ProductListByKeyword);
router.get("/ProductDetails/:ProductID", ProductController.ProductDetails);
router.get("/ProductReviewList/:ProductID", ProductController.ProductReviewList);

module.exports = router;
