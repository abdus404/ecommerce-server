const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const EmailSend = require("../utilities/EmailHelper");
const { EncodeToken } = require("../utilities/TokenHelper");

const UserOTPService = async (req) => { 
  try {
    const { email } = req.params;
    const code = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
    const subject = "Email verification";
    const text = `Your email verification code is ${code}`;

    //send email
    await EmailSend(email, subject, text);
    //update user
    await UserModel.updateOne({ email }, { $set: { otp: code } }, { upsert: true });

    return { status: "success", message: "6 digit OTP has been sent" };
  } catch (error) {
    return { status: "fail", message: "Something went wrong", error: error.message };
  }
};

const VerifyLoginService = async (req) => {
  try {
    const { email, otp } = req.params;

    // Find user with matching email and otp
    const user = await UserModel.findOne({ email, otp });

    if (user) {
      const user_id = user._id.toString();
      // Create token
      const token = EncodeToken(email, user_id);
      // Update otp
      await UserModel.updateOne({ email }, { $set: { otp: "0" } });
      return { status: "success", message: "Valid OTP", token };
    } else {
      return { status: "fail", message: "Invalid OTP" };
    }
  } catch (error) {
    return { status: "fail", message: "Something went wrong", error: error.message };
  }
};

const UpsertProfileService = async (req) => {
  try {
    const userId = req.headers.userId;
    const reqBody = req.body;

    // Validate reqBody
    if (!reqBody || Object.keys(reqBody).length === 0) {
      return { status: "fail", message: "Request body is empty" };
    }

    reqBody.userID = userId;

    // Upsert profile: create a new one if it doesn't exist, otherwise update the existing one
    const profile = await ProfileModel.findOneAndUpdate(
      { userID: userId },
      reqBody,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return { status: "success", data: profile };
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

const ReadProfileService = async (req) => {
  try {
    const userId = req.headers.userId;
    const profile = await ProfileModel.findOne({ userID: userId });
    return {status:"success", data:profile}
  } catch (error) {
    return { status: "fail", message: error.message };
  }
};

module.exports = {
  UserOTPService,
  VerifyLoginService,
  UpsertProfileService,
  ReadProfileService,
};
