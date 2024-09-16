const { Router } = require("express");

const router = Router();

// Import controllers for handling different routes
const {
    create,
} = require("../controllers/coinController");

// coin routes
router.post("/create", create);

module.exports = router;
