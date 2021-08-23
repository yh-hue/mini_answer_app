// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _=db.command;
//const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  var date=new Date();
  try{
  if(date.getHours()==0){
   await db.collection('user_data').where({
    usedStep:_.gt(0)
   }).update({
      data:{
        usedStep: 0,
      },
      success:res=>{console.log(res);}
    })
  }
  // awaitdb.collection('credit_info').aggregate().lookup({
  //   from:'user_list',
  //   localField:'openid',
  //   foreignField:'openid',
  //   as:'userInfo'
  // }).bucket({
  //   groupBy: '$userInfo.department',
  //   boundaries: [0, 50, 100],
  //   default: 'other',
  //   output: {
  //     count: $.sum(1),
  //     ids: $.push('$_id')
  //   }
  // })
}catch(e){
      console.log(e);
    }
    return event;
}