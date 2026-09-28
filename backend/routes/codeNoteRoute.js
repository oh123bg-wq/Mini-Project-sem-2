const express = require("express");
const router = express.Router();
const codeNoteController = require("../controllers/CodeNoteController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.post("/", auth.authenticate, codeNoteController.addNewNote);
router.get("/", auth.authenticate, codeNoteController.getAllNotes);
router.get("/:id", auth.authenticate, codeNoteController.getNoteById);
router.put("/:id", auth.authenticate, codeNoteController.updateNote);
router.patch("/:id/pin", auth.authenticate, codeNoteController.togglePinNote);
router.delete("/:id", auth.authenticate, codeNoteController.deleteNote);

module.exports = router;