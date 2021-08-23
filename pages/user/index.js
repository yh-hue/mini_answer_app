// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: null,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad: async function () {
    var that = this;
    if (wx.getUserProfile) {
      that.setData({
        canIUseGetUserProfile: true
      })
     }
     wx.showLoading({
       title: '加载中...',
       mask: true
     })
         await wx.cloud.callFunction({
           name: 'getUserInfo'
         }).then(res => {
           if (res.result.data.length !== 0) {
             console.log('用户已经存在，开始读取云端数据');
             that.getAuth(that);
             that.setData({
               hasUserInfo: true,
               userInfo: res.result.data[0]
             })
             wx.setStorageSync('userInfo', res.result.data[0])
           }
         })
         wx.hideLoading({});
  },

  getUserProfile(e) {
    var that=this;
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res1) => {
        console.log(res1);
        that.setData({
          hasUserInfo: true,
          userInfo: res1.userInfo
        })
        wx.setStorageSync('userInfo', res1.userInfo);
       wx.cloud.callFunction({
          name: 'getUserInfo'
        }).then(res => {
          if (res.result.data.length !== 0) {
            console.log('用户已经存在，开始读取云端数据');
            that.getAuth(that);
          }else{
            wx.cloud.callFunction({
              name: 'addUser',
              data: {
                avatarUrl: res1.userInfo.avatarUrl,
                nickName: res1.userInfo.nickName
              }
            })
    
            this.getAuth(this);
    
            wx.navigateTo({
              url: '/pages/myInfo/index',
            }).then(() => {
              wx.showToast({
                title: '请完善个人信息！',
                icon: 'none',
                mask: true
              })
            })
          }
          that.setData({
            hasUserInfo: true,
            userInfo: res.result.data[0]
          })
        });
        
        

      }
    });
    setTimeout(() => {
      wx.hideLoading({});
    }, 500)
  },
  //获取授权
  getAuth(This) {
    var that = This;
    //获取用户授权           
    wx.getSetting({
      success(res) {
        //用户是否授权微信步数
        if (!res.authSetting['scope.werun']) {
          //发起用户授权
          wx.authorize({
            scope: 'scope.werun',
            success() {
              //授权成功，调用微信步数接口
              that.getStep();
            },
            fail(res) {
              //用户拒绝授权 自定义弹窗
              wx.showModal({
                title: '温馨提示',
                content: '您需要授权微信步数才能正常使用本小程序哦~',
                cancelText: "不授权",
                confirmText: "授权",
                confirmColor: "#a08250",
                success: function (res) {
                  console.log(res);
                  if (res.confirm) {
                    // 这个 API 是基础库 1.1.0 才有的，所以需要做兼容处理：
                    wx.openSetting({})
                    console.log(wx.openSetting);
                    that.getStep();
                  }
                  //用户继续拒绝授权。
                  else if (res.cancel) {
                    wx.showModal({
                      title: '温馨提示',
                      content: '微信步数获取失败，错过授权页面的处理方法：授权设置->微信步数->点击授权按钮',
                      showCancel: false,
                      confirmColor: "#21C5B4",
                    })
                  }
                }
              })
            }
          })
        } else { //用户已授权
          that.getStep();
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  //获取微信步数
  getStep() {
    var that = this;

    wx.login({
      success: function (resLonin) {
        console.log(resLonin)
        console.log(resLonin.code)
        wx.getWeRunData({
          success: function (resRun) {
            console.log("微信运动密文：")
            console.log(resRun)
            wx.cloud.callFunction({
              name: 'wxStep',//云函数的文件名
              data: {
                weRunData: wx.cloud.CloudID(resRun.cloudID),
                obj: {
                  shareInfo: wx.cloud.CloudID(resRun.cloudID)
                }
              },
              success: function (res) {
                console.log("云函数接收到的数据:")
                console.log(res)
                let step = res.result.event.weRunData.data.stepInfoList[30].step
                that.setData({
                  step: step
                })
                wx.setStorageSync('stepArry', res.result.event.weRunData.data.stepInfoList);
                wx.setStorageSync('todayStep', that.data.step);
                console.log("得到的今日步数：", that.data.step)
              }
            })
          },
        })
      }
    })
  },
  //打开授权页面
  handleopenSetting() {
    wx.openSetting({
      complete: (res) => {
        console.log(res);
      },
    })
  },
  //下拉刷新
  onPullDownRefresh: async function () {
    var that = this;
    if (wx.getUserProfile) {
      that.setData({
        canIUseGetUserProfile: true
      })
    }
    await wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then(res => {
      if (res.result.data.length !== 0) {
        console.log('用户已经存在，开始读取云端数据');
        that.getAuth(that);
        that.setData({
          hasUserInfo: true,
          userInfo: res.result.data[0]
        })
        wx.setStorageSync('userInfo', res.result.data[0])
      }
    })
    setTimeout(()=>{
      wx.stopPullDownRefresh();
  },300)
  },


})