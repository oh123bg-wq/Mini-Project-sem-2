const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const auth = require('../middlewares/auth')

router.use(express.json());

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/", auth.authenticate, userController.getAllUsers);

module.exports = router;
