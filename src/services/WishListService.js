const WishModel = require("../models/WishModel");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const WishListService = async (req) => {
  try {
    const userId = new ObjectId(req.headers.userId);
    let MatchStage = { $match: { userID: userId } };
    let JoinWithProductStage = {
      $lookup: {
        from: "products",
        localField: "productID",
        foreignField: "_id",
        as: "product",
      },
    };
    let JoinWithBrandStage = {
      $lookup: {
        from: "brands",
        localField: "product.brandID",
        foreignField: "_id",
        as: "brand",
      },
    };
    let JoinWithCategoryStage = {
      $lookup: {
        from: "categories",
        localField: "product.categoryID",
        foreignField: "_id",
        as: "category",
      },
    };
    let UnwindBrandStage = { $unwind: "$brand" };
    let UnwindCategoryStage = { $unwind: "$category" };
    let UnwindWithProductStage = { $unwind: "$product" };
    JoinWithProductStage;
    let ProjectionStage = {
      $project: {
        "brand._id": 0,
        "brand.createdAt": 0,
        "brand.updatedAt": 0,
        "category.createdAt": 0,
        "category.updatedAt": 0,
        "category._id": 0,
        "product._id": 0,
        "product.categoryID": 0,
        "product.brandID": 0,
        "product.createdAt": 0,
        "product.updatedAt": 0,

        brandID: 0,
        categoryID: 0,
      },
    };

    let data = await WishModel.aggregate([
      MatchStage,
      JoinWithProductStage,
      JoinWithBrandStage,
      JoinWithCategoryStage,
      UnwindBrandStage,
      UnwindCategoryStage,
      UnwindWithProductStage,
      ProjectionStage,
    ]);
    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

const SaveWishListService = async (req) => {
  try {
    const userId = req.headers.userId;
    const reqBody = req.body;

    // Validate reqBody
    if (!reqBody || Object.keys(reqBody).length === 0) {
      return { status: "fail", message: "Request body is empty" };
    }

    reqBody.userID = userId;

    // Upsert profile: create a new one if it doesn't exist, otherwise update the existing one
    const data = await WishModel.findOneAndUpdate({ userID: userId }, reqBody, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const RemoveWishListService = async (req) => {
  try {
    const userId = req.headers.userId;
    const reqBody = req.body;

    // Validate the presence of userId in headers
    if (!userId) {
      return { status: "fail", message: "User ID is missing in headers" };
    }

    // Validate reqBody
    if (!reqBody || Object.keys(reqBody).length === 0) {
      return { status: "fail", message: "Request body is empty" };
    }

    // Add userId to reqBody
    reqBody.userID = userId;

    // Delete the wish list item(s)
    const result = await WishModel.deleteOne(reqBody);

    // Check if the item was actually deleted
    if (result.deletedCount === 0) {
      return { status: "fail", message: "Wish list item not found" };
    }

    return {
      status: "success",
      message: "Wish list item removed successfully",
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in RemoveWishListService:", error);

    // Return a more detailed error message
    return {
      status: "fail",
      message: "An error occurred while removing the wish list item",
      error: error.message,
    };
  }
};

module.exports = {
  WishListService,
  SaveWishListService,
  RemoveWishListService,
};
