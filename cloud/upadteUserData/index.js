// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ = db.command;
const $=db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.ind=='DH'){
  await db.collection('user_data').where({openid:wxContext.OPENID}).update({
    data:{
      totalDistance:event.totalDistance,
      totalDay:event.totalDay,
      usedStep: event.usedStep,
      last_DH_day:event.last_DH_day
    }
  }).then(res=>{
    console.log(res);
  })
  .catch(console.error);
}else if(event.ind=='UP_CREDIT'){//更新积分信息
  await db.collection('credit_info').where({openid:wxContext.OPENID}).update({
    data:{
      section_info:event.section_info,
      section_credit:event.section_credit,
      step_credit:event.step_credit,
      answer_credit:event.answer_credit,
      total_credit:event.total_credit
    }
  }).then(res=>{
    console.log(res);
  })
}else if(event.ind=='GET_CREDIT'){//获取积分信息
  return await db.collection('credit_info').where({openid:wxContext.OPENID}).get();
}else if(event.ind=='GETSECTION'){
   return await db.collection('sectionInfo').where({page_id:event.page_id}).get();
}else if(event.ind=='WRONG'){//更新错题信息
   await db.collection('wrong').where({openid:wxContext.OPENID}).update({
    data:{
      problems:_.push(event.wrong)
    }
  }).then(res=>{
    console.log(res);
  }).catch(erro=>{
    console.log(erro);
  })
}else if(event.ind=='departmentNum'){//获取团支部参与人数
  return await db.collection('user_list').aggregate().group({
    _id:'$department',
    num:$.sum(1),
  }).sort({
    num:-1
  }).skip(event.skip_num).end()
}else if(event.ind=='TOTAL'){//获取全部团支部数量
  return await db.collection('user_list').aggregate().group({
    _id:'$department',
    num:$.sum(1),
  }).count('total').end()
}
}