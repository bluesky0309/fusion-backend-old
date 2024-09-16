const AppError = require("../utils/appError");

const requireUser = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(
        new AppError(400, `Session has expired or user doesn't exist`)
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireUser;
