const { DecodeToken } = require("../utilities/TokenHelper");

module.exports = (req, res, next) => {
  let token = req.headers["token"] || req.cookies["token"];

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = DecodeToken(token);

    if (!decoded) {
      return res.status(401).json({ status: "fail", message: "Unauthorized: Invalid token" });
    }

    const { email, user_id: userId } = decoded;
    req.headers.email = email;
    req.headers.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({ status: "fail", message: "Unauthorized: Token decoding failed" });
  }
};
