const ClassNote = require("../models/ClassNote");

exports.addNewNote = async (req, res) => {
    try {
        // 根据前端提交的 req.body 创建一个新的 ClassNote 实例
        const note = new ClassNote(req.body);

        // 将新笔记异步保存至 MongoDB 数据库
        await note.save();

        // 保存成功，向前端返回 HTTP 状态码 201 (Created) 以及刚创建的笔记 JSON 数据
        res.status(201).json(note);
    } catch (error) {
        // 捕获异常（如校验失败），返回 HTTP 状态码 400 (Bad Request) 和错误提示
        res.status(400).json({ error: error.message });
    }
};

// 获取当前用户的所有笔记 (Read All)
exports.getAllNotes = async (req, res) => {
    try {
        // 数据隔离：仅查询 userEmail 等于当前登录用户 (req.userEmail) 的笔记
        // .sort({ isPinned: -1, updatedAt: -1 })：按置顶状态降序 (置顶在前)，再按更新时间倒序 (最新在前)
        const notes = await ClassNote.find({ userEmail: req.userEmail })
            .sort({ isPinned: -1, updatedAt: -1 });

        // 将查到的笔记数组以 JSON 格式返回给前端
        res.json(notes);
    } catch (error) {
        // 如果数据库查询出错，返回 HTTP 状态码 500 (Server Error)
        res.status(500).json({ error: error.message });
    }
};

// 获取单条笔记详情 (Read One)
exports.getNoteById = async (req, res) => {
    try {
        // 根据 URL 参数里的 id (_id: req.params.id) 以及 userEmail 匹配查询单条笔记
        const note = await ClassNote.findOne({ _id: req.params.id, userEmail: req.userEmail });

        // 如果找不到匹配的笔记（说明笔记不存在或不属于当前用户）
        if (!note) {
            // 返回 HTTP 状态码 404 (Not Found)
            return res.status(404).json({ error: "Note not found." });
        }

        // 找到了则返回该笔记对象
        res.json(note);
    } catch (error) {
        // 捕获服务器或 ID 格式错误，返回 HTTP 状态码 500
        res.status(500).json({ error: error.message });
    }
};

// 更新笔记内容 (Update)
exports.updateNote = async (req, res) => {
    try {
        // findOneAndUpdate：同时验证 _id 和 userEmail，并用 req.body 中的新字段更新它
        // { new: true } 表示返回更新成功后的最新文档对象（而非修改前的数据）
        const note = await ClassNote.findOneAndUpdate(
            { _id: req.params.id, userEmail: req.userEmail },
            req.body,
            { new: true }
        );

        // 如果找不到符合条件且有权限的笔记
        if (!note) {
            return res.status(404).json({ error: "Note not found or unauthorized." });
        }

        // 返回更新后的最新笔记对象
        res.json(note);
    } catch (error) {
        // 更新过程中出错（如参数校验不通过），返回 HTTP 状态码 400
        res.status(400).json({ error: error.message });
    }
};

// 切换 Pin / Unpin 状态 (Toggle Pin)
exports.togglePinNote = async (req, res) => {
    try {
        // 先查询属于该用户的指定 ID 笔记
        const note = await ClassNote.findOne({ _id: req.params.id, userEmail: req.userEmail });

        // 如果笔记不存在或不属于当前用户，返回 404
        if (!note) {
            return res.status(404).json({ error: "Note not found." });
        }

        // 取反当前 isPinned 布尔值：若当前为 true 则变为 false，反之亦然
        note.isPinned = !note.isPinned;

        // 保存修改后的状态回 MongoDB
        await note.save();

        // 返回更新状态后的笔记对象
        res.json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 删除笔记 (Delete)
exports.deleteNote = async (req, res) => {
    try {
        // findOneAndDelete：查找匹配 _id 和 userEmail 的笔记并从数据库中直接删除
        const note = await ClassNote.findOneAndDelete({ _id: req.params.id, userEmail: req.userEmail });

        // 如果没有找到符合条件的笔记，说明无权删除或已被删除
        if (!note) {
            return res.status(404).json({ error: "Note not found or unauthorized." });
        }

        // 删除成功，返回成功提示信息
        res.json({ message: "Note deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};