const express = require("express");
const router = express.Router();
const { getResponse } = require("../controllers/main");

router.post("/response", getResponse);

module.exports = router;
