const express = require("express");
const router = express.Router();
const classNoteController = require("../controllers/ClassNoteController");
const auth = require('../middlewares/auth')

router.use(express.json());

router.post("/", auth.authenticate, classNoteController.addNewNote);              // 创建笔记
router.get("/", auth.authenticate, classNoteController.getAllNotes);                 // 获取列表
router.get("/:id", auth.authenticate, classNoteController.getNoteById);           // 获取单条详情
router.put("/:id", auth.authenticate, classNoteController.updateNote);            // 更新笔记
router.patch("/:id/pin", auth.authenticate, classNoteController.togglePinNote);   // 切换 Pin 状态
router.delete("/:id", auth.authenticate, classNoteController.deleteNote);         // 删除笔记

module.exports = router;