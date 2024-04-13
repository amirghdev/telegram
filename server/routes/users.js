const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

// @desc : send code with email
// @route : /users/send-code POST
router.post("/send-code", usersController.sendCode);

// @desc : validate code anc check for expire
// @route : /users/validate-code POST
router.post("/validate-code", usersController.validateCode);

module.exports = router;
