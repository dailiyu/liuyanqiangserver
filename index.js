// 引入 express 框架
const express = require("express");
// 创建网站服务器
const app = express();
const path = require("path"); //引入解析路径模块
const ejs = require("ejs"); //解析html
let config = require("./config/default"); // 引入配置文件
//获取静态路径
// app.use(express.static(__dirname + "/views"));
// app.use(express.static(__dirname + "/data"));
//获取静态路径
app.use(express.static(__dirname + "/dist"));
// 定义静态文件目录，将整个 '/data' 路径映射到实际的目录
app.use("/photo", express.static(path.join(__dirname, "data", "photo")));
// app.use("/", express.static(path.join(__dirname, "dist")));

// cors同源策略
const cors = require("cors");
// 解决同源
app.use(cors());
//设置跨域访问
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//加入html视图
app.engine("html", ejs.__express);
app.set("view engine", "html");
//解析前端数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require("./routes/index");
// const router2 = require("./routes/files");
app.use(router);
// app.use(router2);
// 监听端口
app.listen(config.port, () => {
  console.log("网站服务器启动成功");
});
