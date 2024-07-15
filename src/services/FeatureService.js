const FeatureModel = require("../models/FeatureModel");

const FeatureListService = async () => {
  try {
    let data = await FeatureModel.find();
    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", data: error.toString() };
  }
};

module.exports = {
  FeatureListService
};
