// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ = db.command;
const $=db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.ind=='RANK'){
  return {
    rank_list:await db.collection('credit_info').aggregate().lookup({
    from:'user_list',
    localField:'openid',
    foreignField:'openid',
    as:'userInfo'
  }).sort({
    total_credit:-1
  }).end(),
  openid:wxContext.OPENID
}}else if(event.ind=='ANSWER_RANK'){
  return {
    rank_list:await db.collection('credit_info').aggregate().lookup({
    from:'user_list',
    localField:'openid',
    foreignField:'openid',
    as:'userInfo'
  }).sort({
    answer_credit:-1
  }).end(),
  openid:wxContext.OPENID
}
}else if(event.ind=='DEPARTMENT_RANK'){//获取团支部排名
  return await db.collection('user_list').aggregate()
  .lookup({
    from:'credit_info',
    let:{
      id:'$openid',
      user_department:'$department'
    },
    pipeline:$.pipeline()
    .match(
      _.expr(
        $.eq(['$openid','$$id'])
        )).group({
          _id:'$$user_department',
          num:$.sum(1),
          credit:$.avg('$total_credit')
        }).project({
          total_credit:1
        })
    .done(),
    as:'department_info'
  }).skip(event.skip_num).end()
}
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}