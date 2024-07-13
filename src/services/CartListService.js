const CartModel = require("../models/CartModel");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const CartListService = async (req) => {
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

    let data = await CartModel.aggregate([
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

const SaveCartListService = async (req) => {
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

    reqBody.userID = userId;

    // Upsert profile: create a new one if it doesn't exist, otherwise update the existing one
    const data = await CartModel.create(reqBody);

    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const UpdateCartListService = async (req) => {
  try {
    const userId = req.headers.userId;
    const cartID = req.params.cartID
    const reqBody = req.body;

    // Validate reqBody
    if (!reqBody || Object.keys(reqBody).length === 0) {
      return { status: "fail", message: "Request body is empty" };
    }

    // Upsert profile: create a new one if it doesn't exist, otherwise update the existing one
    const data = await CartModel.updateOne({ _id:cartID, userID: userId }, reqBody);

    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const RemoveCartListService = async (req) => {
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
    const result = await CartModel.deleteOne(reqBody);

    // Check if the item was actually deleted
    if (result.deletedCount === 0) {
      return { status: "fail", message: "Cart list item not found" };
    }

    return {
      status: "success",
      message: "Cart list item removed successfully",
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in RemoveCartListService:", error);

    // Return a more detailed error message
    return {
      status: "fail",
      message: "An error occurred while removing the cart list item",
      error: error.message,
    };
  }
};

module.exports = {
    CartListService,
    SaveCartListService,
    UpdateCartListService,
    RemoveCartListService,
};
