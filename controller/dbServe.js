const dbModel = require("../lib/db");
const path = require("path");
const fs = require("fs");
//新建墙
exports.insertWall = async (req, res) => {
  let data = req.body;

  await dbModel
    .insertWall([
      data.type,
      data.message,
      data.name,
      data.userId,
      data.moment,
      data.label,
      data.color,
      data.imgurl,
    ])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

//新建反馈
exports.insertFeedback = async (req, res) => {
  let data = req.body;

  await dbModel
    .insertFeedback([data.wallId, data.userId, data.type, data.moment])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

//新建评论
exports.inserComment = async (req, res) => {
  let data = req.body;
  await dbModel
    .inserComment([
      data.wallId,
      data.userId,
      data.imgurl,
      data.moment,
      data.comment,
      data.name,
    ])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

//删除墙，主表对应多条子表一起删除
exports.deleteWall = async (req, res) => {
  let data = req.body;
  if (data.imgurl) {
    const currentPath = __dirname; // 当前目录的路径
    const parentPath = path.resolve(path.dirname(currentPath), "..");
    // console.log(data.imgurl, __dirname);
    const imgurl = path.join(parentPath, "server", "data", data.imgurl);
    console.log(imgurl);
    // Mkdir.delFiles(imgurl);
    fs.unlink(imgurl, (err) => {
      if (err) {
        console.error("删除文件出错:", err);
      } else {
        console.log("成功删除文件:");
      }
    });
  }
  await dbModel.deleteWall(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//删除反馈
exports.deleteFeedback = async (req, res) => {
  let data = req.body;
  await dbModel.deleteFeedback(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//删除评论
exports.deleteComment = async (req, res) => {
  let data = req.body;
  await dbModel.deleteComment(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

//分页查询wall并获取赞，举报，撤销数据
exports.findWallPage = async (req, res) => {
  let data = req.body;
  await dbModel
    .findWallPage(data.page, data.pagesize, data.type, data.label)
    .then(async (result) => {
      for (let i = 0; i < result.length; i++) {
        //喜欢
        result[i].like = await dbModel.feedbackCount(result[i].id, 0);
        //举报
        result[i].report = await dbModel.feedbackCount(result[i].id, 1);
        //要求撤销
        result[i].revoke = await dbModel.feedbackCount(result[i].id, 2);
        //是否点赞
        result[i].islike = await dbModel.likeCount(result[i].id, data.userId);
        //评论数
        result[i].comcount = await dbModel.commentCount(result[i].id);
      }
      res.send({
        code: 200,
        message: result,
      });
    });
};

//倒叙分页查墙的评论
exports.findCommentPage = async (req, res) => {
  let data = req.body;
  await dbModel
    .findCommentPage(data.page, data.pagesize, data.id)
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};
