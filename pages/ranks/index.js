// pages/rank/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "总积分排行",
        isActive: true
      }, {
        id: 1,
        value: "答题积分排行",
        isActive: false
      }
    ],
    dis_rank: [],
    myRank: '未上榜',
    myAnswer_Rank: '未上榜',
    Ans_Rank: [],
    style: ['iconfont icon-first', 'iconfont icon-second', 'iconfont icon-third'],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var dis_rank = wx.getStorageSync('rank');
    var myRank = wx.getStorageSync('myrank');
    var Ans_Rank = wx.getStorageSync('Ans_Rank');
    var myAnswer_Rank = wx.getStorageSync('myAnswer_Rank');

    if (myRank) {
      this.setData({
        dis_rank,
        myRank,
        Ans_Rank,
        myAnswer_Rank
      })
    } else {
      this.getrank();
      this.getAnswerRank();
      //this.getDepartmentRank();
    }


  },
  handletabsItemChange(e) {
    const index = e.detail;
    let tabs = JSON.parse(JSON.stringify(this.data.tabs));
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs,
    })
  },
  //获取排名
  getrank() {
    var that = this;
    var rank = [];
    var myRank = '未上榜';
    wx.cloud.callFunction({
      name: 'getrank',
      data: {
        ind: 'RANK'
      }
    }).then(res => {
      console.log(res);
      res.result.rank_list.list.forEach((v, i) => {
        var temp = {};
        temp.total_credit = v.total_credit;
        if (v.userInfo[0].id) {
          temp.Name = v.userInfo[0].Name;
          temp.department = v.userInfo[0].department;
          temp.image = v.userInfo[0].avatarUrl;
        } else {
          temp.image = v.userInfo[0].avatarUrl;
          temp.department = '';
          temp.Name = v.userInfo[0].nickName;
        }
        if (v.openid == res.result.openid) {
          myRank = i + 1;
        }
        rank.push(temp);
      })
      wx.setStorage({
        data: rank,
        key: 'rank',
      })
      wx.setStorageSync('myRank', myRank)
      console.log(rank);
      setTimeout(() => {
        that.setData({
          myRank,
          dis_rank: rank,
          loading: false
        })
      }, 800)
    }).catch(res => {
      console.log(res);
    })
  },

  //获取答题积分排名
  getAnswerRank() {
    var that = this;
    var Ans_Rank = [];
    var myAnswer_Rank = '未上榜';
    wx.cloud.callFunction({
      name: 'getrank',
      data: {
        ind: 'ANSWER_RANK'
      }
    }).then(res => {
      console.log(res);
      res.result.rank_list.list.forEach((v, i) => {
        var temp = {};
        temp.answer_credit = v.answer_credit;
        if (v.userInfo[0].id) {
          temp.Name = v.userInfo[0].Name;
          temp.department = v.userInfo[0].department;
          temp.image = v.userInfo[0].avatarUrl;
        } else {
          temp.image = v.userInfo[0].avatarUrl;
          temp.department = '';
          temp.Name = v.userInfo[0].nickName;
        }
        if (v.openid == res.result.openid) {
          myAnswer_Rank = i + 1;
        }
        Ans_Rank.push(temp);
      })
      wx.setStorage({
        data: Ans_Rank,
        key: 'Ans_Rank',
      })
      wx.setStorageSync('myAnswer_Rank', myAnswer_Rank)
      setTimeout(() => {
        that.setData({
          myAnswer_Rank,
          Ans_Rank,
          loading: false
        })
      }, 800);
     // console.log(Ans_Rank);
    }).catch(res => {
      console.log(res);
    })
  },

  //获取团支部排名
  async getDepartmentRank(){
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
        name:'getrank',
        data: {
          ind: 'DEPARTMENT_RANK',
          skip_num:i*20
      }
      }).then(res=>{
        console.log(res);
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

  onPullDownRefresh(){
    this.getAnswerRank();
    setTimeout(() => {
      wx.stopPullDownRefresh();
  }, 300)
  },


})