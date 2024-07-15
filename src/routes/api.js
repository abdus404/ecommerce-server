const express = require("express");
const ProductController = require("../controllers/ProductController");
const UserController = require("../controllers/UserController");
const WishListController = require("../controllers/WishListController");
const CartListController = require("../controllers/CartListController");
const FeatureController = require("../controllers/FeatureController");
const InvoiceController = require("../controllers/InvoiceController");
const AuthVerification = require("../middlewares/AuthVerification");

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
router.post("/CreateProductReview", AuthVerification, ProductController.CreateProductReview);

// user
router.get("/UserOTP/:email", UserController.UserOTP);
router.get("/VerifyLogin/:email/:otp", UserController.VerifyLogin);
router.get("/UserLogout", AuthVerification, UserController.UserLogout);
router.post("/CreateProfile", AuthVerification, UserController.CreateProfile);
router.post("/UpdateProfile", AuthVerification, UserController.UpdateProfile);
router.get("/ReadProfile", AuthVerification, UserController.ReadProfile);

// wishlist
router.get("/WishList", AuthVerification, WishListController.WishList)
router.post("/SaveWishList", AuthVerification, WishListController.SaveWishList)
router.delete("/RemoveWishList", AuthVerification, WishListController.RemoveWishList)

// cartlist
router.get("/CartList", AuthVerification, CartListController.CartList)
router.post("/SaveCartList", AuthVerification, CartListController.SaveCartList)
router.post("/UpdateCartList/:cartID", AuthVerification, CartListController.UpdateCartList)
router.delete("/RemoveCartList", AuthVerification, CartListController.RemoveCartList)

// invoice
router.get("/CreateInvoice", AuthVerification, InvoiceController.CreateInvoice)
router.get("/InvoiceList", AuthVerification, InvoiceController.InvoiceList)
router.get("/InvoiceProductList/:invoiceID", AuthVerification, InvoiceController.InvoiceProductList)

router.get("/PaymentSuccess/:trxID", InvoiceController.PaymentSuccess)
router.get("/PaymentCancel/:trxID", InvoiceController.PaymentCancel)
router.get("/PaymentFail/:trxID", InvoiceController.PaymentFail)
router.get("/PaymentIPN/:trxID", InvoiceController.PaymentIPN)

// feature
router.get("/FeatureList", FeatureController.FeatureList);


module.exports = router;
