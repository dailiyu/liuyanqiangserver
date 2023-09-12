const controller = require("../controller/dbServe");
//1. 导入 express
const express = require("express");

//2. 创建路由对象
const router = express.Router();

//新建墙
router.post("/insertwall", (req, res) => {
  controller.insertWall(req, res);
});
//新建反馈
router.post("/insertfeedback", (req, res) => {
  controller.insertFeedback(req, res);
});
//新建评论
router.post("/insercomment", (req, res) => {
  controller.inserComment(req, res);
});
//删除墙，主表对应多条子表一起删除
router.post("/deletewall", (req, res) => {
  controller.deleteWall(req, res);
});

//删除反馈
router.post("/deletefeedback", (req, res) => {
  controller.deleteFeedback(req, res);
});
//删除评论
router.post("/deletecomment", (req, res) => {
  controller.deleteComment(req, res);
});
//分页查询wall并获取赞，举报，撤销数据
router.post("/findwallpage", (req, res) => {
  controller.findWallPage(req, res);
});
//倒叙分页查墙的评论
router.post("/findcommentpage", (req, res) => {
  controller.findCommentPage(req, res);
});

//返回用户ip
router.post("/signip", (req, res) => {
  let ip = req.ip;
  res.send({ code: 200, ip: ip });
});

const multer = require("multer");
const storage = multer.diskStorage({
  //保存路径
  destination: function (req, file, cb) {
    cb(null, "../server/data/photo");
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
router.post("/profile", upload.single("file"), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  console.log("路由匹配成功");
  let name = req.file.filename;
  let imgurl = "/photo/" + name;
  //返回存储路径
  res.send(imgurl);
});

//返回图片
router.get("/photo/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "data", "photo", filename);

  // 发送图片文件
  res.sendFile(imagePath);
});

//测试
router.post("/test", (req, res) => {
  console.log("服务器收到请求");
  res.send("服务器收到请求");
});

module.exports = router;
