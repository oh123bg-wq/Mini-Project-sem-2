const express = require("express");
const router = express.Router();
const cheatsheetController = require("../controllers/CheatsheetController");
const auth = require("../middlewares/auth");

// Translates the JSON text sent from the frontend 
// into a JavaScript object (req.body)
router.use(express.json());

router.post("/", auth.authenticate, cheatsheetController.addNewCheatsheet);
router.get("/", auth.authenticate, cheatsheetController.getAllCheatsheets);
router.get("/:id", auth.authenticate, cheatsheetController.getCheatsheetById);
router.put("/:id", auth.authenticate, cheatsheetController.updateCheatsheet);
router.delete("/:id", auth.authenticate, cheatsheetController.deleteCheatsheet);

module.exports = router;