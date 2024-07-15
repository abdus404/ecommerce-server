const {
  FeatureListService
} = require("../services/FeatureService");

exports.FeatureList = async (req, res) => {
  let result = await FeatureListService();
  return res.status(200).json(result);
};
