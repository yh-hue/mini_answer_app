// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 创建用户信息表
  await db.collection('user_data').add({
    data:{
      openid:wxContext.OPENID,
      totalDistance:event.totalDistance,
      totalDay:event.totalDay,
      usedStep: event.usedStep,
      last_DH_day:event.last_DH_day,
    }
  }).then(res=>{
    console.log( console.log(res));
  })
  .catch(console.error);

  
}