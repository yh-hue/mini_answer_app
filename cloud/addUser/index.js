// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
   // 创建用户信息
  await db.collection('user_list').add({
    // data 字段表示需新增的 JSON 数据
  data: {
    openid: wxContext.OPENID,
    nickName:event.nickName,
    avatarUrl:event.avatarUrl
  }
}).then(res => {
  console.log(res)
})
.catch(console.error);

  //创建用户错题集
  await db.collection('wrong').add({
    data:{openid:wxContext.OPENID}
  }).then(res=>{
    console.log(res);
  }).catch(erro=>{
    console.log(erro);
  })

  // 创建用户积分详情，答题记录表
  await db.collection('credit_info').add({
    data:{
      openid:wxContext.OPENID,
      section_info:[0,0,0,0,0,0,0,0,0,0],
      section_credit:[0,0,0,0,0,0,0,0,0,0],
      step_credit:0,
      answer_credit:0,
      total_credit:0

    }
  }).then(res=>{
    console.log(res);
  }).catch(erro=>{
    console.log(erro);
  })
}