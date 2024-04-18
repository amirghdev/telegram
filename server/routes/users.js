const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.post("/sendRegisterCode", usersController.sendRegisterCode);

router.post("/validate-code", usersController.validateCode);

router.post("/register", usersController.register);

router.post("/sendLoginCode", usersController.sendLoginCode);

router.post("/login", usersController.login);

router.post("/auth", usersController.auth);

module.exports = router;
