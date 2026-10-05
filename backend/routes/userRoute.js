const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const auth = require('../middlewares/auth')

router.use(express.json());

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/", auth.authenticate, userController.getAllUsers);

router.delete("/:id", auth.authenticate, auth.requireAdmin, userController.deleteUser);

router.put("/:id", auth.authenticate, auth.requireAdmin, userController.updateUser);

module.exports = router;
