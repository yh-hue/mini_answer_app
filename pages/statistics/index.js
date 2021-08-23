// pages/statistics/index.js


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    detail:[]
  },

  onShow:async function () {
    let total=0;
    let that=this;
    await wx.cloud.callFunction({//获取全部数据条数
      name:'upadteUserData',
      data:{
        ind:'TOTAL'
      }
    }).then(v=>{
      total=v.result.list[0].total;
      console.log(total);
    });

    let batchTimes=Math.ceil(total/20);//需要获取多少次数据
    let arraypro=[];//定义空数组 用于储存每一次获取到的数据
    let x=0;//这是一个标识每次循环就+1 当x等于batchTimes 说明已经到了最后一次获取数据的时候
    for(let i=0;i<batchTimes;i++){
      console.log(i);
      await wx.cloud.callFunction({//获取数据
        name:'upadteUserData',
        data: {
          ind: 'departmentNum',
          skip_num:i*20
      }
      }).then(res=>{
        x+=1;
        for(let j=0;j<res.result.list.length;j++){
          arraypro.push(res.result.list[j])
        }

        if(x==batchTimes){
          console.log(arraypro);
          arraypro[0]._id='未知部门'
          that.setData({
            detail:arraypro
          })
        }
        
      })
    }

  },

 
})