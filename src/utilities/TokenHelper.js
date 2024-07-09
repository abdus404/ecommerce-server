const jwt = require("jsonwebtoken");

exports.EncodeToken = (email, user_id) => {
  let SECRET_KEY = "123-ABC-XYZ";
  let EXPIRE = { expiresIn: "24h" };
  let PAYLOAD = { email: email, user_id: user_id };
  return jwt.sign(PAYLOAD, SECRET_KEY, EXPIRE);
};

exports.DecodeToken = (token) => {
  try {
    let SECRET_KEY = "123-ABC-XYZ";
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};


