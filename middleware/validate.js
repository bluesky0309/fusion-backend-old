import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: "fail",
        errors: error.errors,
      });
    }
    next(error);
  }
};

module.exports = validate;
