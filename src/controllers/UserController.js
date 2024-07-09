const {
  UserOTPService,
  VerifyLoginService,
  UpsertProfileService,
  ReadProfileService,
} = require("../services/UserService");

exports.UserOTP = async (req, res) => {
  const result = await UserOTPService(req);
  return res.status(200).json(result);
};

exports.VerifyLogin = async (req, res) => {
  const result = await VerifyLoginService(req);

  if(result.status === 'success'){
    // Cookie options
    let cookieOption = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
      httpOnly: false,
    };

    // Set cookie
    res.cookie('token', result.token, cookieOption);
    res.status(200);
  } else {
    res.status(400);
  }

  return res.json(result);
};

exports.UserLogout = async (req, res) => {
  // Cookie options to expire the cookie
  const cookieOption = {
    expires: new Date(Date.now() - 24 * 60 * 60 * 1000), 
    httpOnly: false, 
  };

  // Set cookie to an empty string and expire it
  res.cookie('token', "", cookieOption);
  
  // Send response
  return res.status(200).json({ status: "success", message: "Logged out successfully" });
};

exports.CreateProfile = async (req, res) => {
  const result = await UpsertProfileService(req);
  return res.status(200).json(result);
};

exports.UpdateProfile = async (req, res) => {
  const result = await UpsertProfileService(req);
  return res.status(200).json(result);
};

exports.ReadProfile = async (req, res) => {
  const result = await ReadProfileService(req);
  return res.status(200).json(result);
};
