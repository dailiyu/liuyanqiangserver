//1. 导入 express
const express = require("express");
//2. 创建路由对象
const router2 = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  //保存路径
  destination: function (req, file, cb) {
    cb(null, "../data/photos");
    //注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
  },
  //保存在 destination 中的文件名
  filename: function (req, file, cb) {
    //正则匹配后缀名
    let type = file.originalname.replace(/.+\./, ".");
    cb(null, file.fieldname + "-" + Date.now() + type);
  },
});

const upload = multer({ storage: storage });

//路由匹配并向前端反馈
router2.post("/profile", upload.single("file"), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  console.log("路由匹配成功");
  let name = req.file.filename;
  let imgurl = "/photo/" + name;
  res.send(imgurl);
});

module.exports = router2;
