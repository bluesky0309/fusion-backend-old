const { omit } = require("lodash");
const AppError = require("../utils/appError");
const verifyJwt = require("../utils/jwt");
const User = require("../models/User");

const deserializeUser = async (req, res, next) => {
  try {
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    }

    if (!access_token) {
      return next(new AppError(401, "You are not logged in"));
    }

    // Validate the access token
    const decoded = verifyJwt(access_token);
    if (!decoded) {
      return next(new AppError(401, `Invalid token or user doesn't exist`));
    }

    // Check if the user still exist
    const { user_id } = decoded.user;

    const user = await User.findOne({ user_id }).populate("groups.groupId");
    if (!user) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }

    // Add user to res.locals
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = deserializeUser;
