// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
   return await db.collection('user_list').where({
    openid: wxContext.OPENID,
   }).update({
     data:{
       Name:event.Name,
       department:event.department,
       id:event.id
     }
   }).catch(erro=>{
     console.log(erro);
   })
}