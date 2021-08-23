// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if(event.ind=='TIKU'){
    // 获取题库
    return await db.collection('tiku').doc(event.tiku).get()
  }else if(event.ind=='PROBLEMS'){
    // 获取错题信息
    return await db.collection('wrong').where({openid:wxContext.OPENID}).get()
  }
}