const express = require("express");
const router = express.Router();
const classNoteController = require("../controllers/ClassNoteController");
const auth = require('../middlewares/auth')

router.use(express.json());

router.post("/", auth.authenticate, classNoteController.addNewNote); 
router.get("/", auth.authenticate, classNoteController.getAllNotes); 
router.get("/:id", auth.authenticate, classNoteController.getNoteById); 
router.put("/:id", auth.authenticate, classNoteController.updateNote); 
// change pin status
router.patch("/:id/pin", auth.authenticate, classNoteController.togglePinNote); 
router.delete("/:id", auth.authenticate, classNoteController.deleteNote); 

module.exports = router;