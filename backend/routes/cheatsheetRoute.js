const express = require("express");
const router = express.Router();
const cheatsheetController = require("../controllers/CheatsheetController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.post("/", auth.authenticate, cheatsheetController.addNewCheatsheet);
router.get("/", auth.authenticate, cheatsheetController.getAllCheatsheets);
router.get("/:id", auth.authenticate, cheatsheetController.getCheatsheetById);
router.put("/:id", auth.authenticate, cheatsheetController.updateCheatsheet);
router.patch("/:id/pin", auth.authenticate, cheatsheetController.togglePinCheatsheet);
router.delete("/:id", auth.authenticate, cheatsheetController.deleteCheatsheet);

module.exports = router;