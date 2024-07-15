const {
  ProductBrandListService,
  ProductCategoryListService,
  ProductSliderListService,
  ProductListByBrandService,
  ProductListByCategoryService,
  ProductListBySmilierService,
  ProductListByKeywordService,
  ProductListByRemarkService,
  ProductDetailsService,
  ProductReviewListService,
  CreateProductReviewService
} = require("../services/ProductService");


exports.ProductBrandList = async (req, res) => {
  let result = await ProductBrandListService();
  return res.status(200).json(result);
};

exports.ProductCategoryList = async (req, res) => {
  let result = await ProductCategoryListService();
  return res.status(200).json(result);
};

exports.ProductSliderList = async (req, res) => {
  let result = await ProductSliderListService();
  return res.status(200).json(result);
};


exports.ProductListByBrand = async (req, res) => {
  let result = await ProductListByBrandService(req);
  return res.status(200).json(result);
};  

exports.ProductListByCategory = async (req, res) => {
  let result = await ProductListByCategoryService(req);
  return res.status(200).json(result);
};

exports.ProductListByRemark = async (req, res) => {
  let result = await ProductListByRemarkService(req);
  return res.status(200).json(result);
};


exports.ProductListBySmilier = async (req, res) => {
  let result = await ProductListBySmilierService(req);
  return res.status(200).json(result);
};

exports.ProductListByKeyword = async (req, res) => {
  let result = await ProductListByKeywordService(req);
  return res.status(200).json(result);
};


exports.ProductDetails = async (req, res) => {
  let result = await ProductDetailsService(req);
  return res.status(200).json(result);
};

exports.ProductReviewList = async (req, res) => {
  let result = await ProductReviewListService(req);
  return res.status(200).json(result);
};

exports.CreateProductReview = async (req, res) => {
  let result = await CreateProductReviewService(req);
  return res.status(200).json(result);
};
