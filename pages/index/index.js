Page({

    /**
     * 页面的初始数据
     */
    data: {
        myStep: 0,
        swiper_img: ['https://i.loli.net/2021/03/27/QUmyFJAGPtNKXjs.jpg',
            'https://i.loli.net/2021/03/27/4AGdyQYBWhR7gK8.jpg',
            'https://i.loli.net/2021/03/27/Z7aGEcyLehuzdUW.jpg'
        ],
        userInfo: null,
        myCredit: 0,
        myRank: '未上榜',
        top_three: null,
        guide_mask: 'none',
        image_loading:true
    },
    imageLoad(e){
       this.setData({
        image_loading:false
       });
    },

    onShow: function () {
        let userInfo = wx.getStorageSync('userInfo');
        this.imageLoad();
        this.getrank();//获取排名
        wx.getSetting({
            success: res => {
                if (!userInfo) {
                    wx.showToast({
                        title: '请先登录！',
                        icon: 'none',
                        mask: true,
                        fail: function () {
                            console.log("Toast失败！");
                        }
                    })
                    setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/user/index',
                          })
                      }, 1000);
                    
                } else if (!res.authSetting['scope.werun']) {
                    wx.showToast({
                        title: '请先授权获取微信步数！',
                        icon: 'none',
                        mask: true,
                        fail: function () {
                            console.log("Toast失败！");
                        }
                    })
                } else {
                    wx.showLoading({
                        title: '加载中...',
                        mask: true
                    });
                    this.getStep();
                    this.getuserData();
                    this.setData({
                        userInfo
                    })
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 600)

                }
            }
        })
    },
    //获取用户活动数据
    getuserData() {
        let myCredit = 0;
        wx.cloud.callFunction({
            name: 'upadteUserData',
            data: {
                ind: 'GET_CREDIT'
            }
        }).then(res => {
            myCredit = res.result.data[0].total_credit;
            this.setData({
                myCredit
            })
        }).catch(console.error);
    },
    //获取排名
    getrank() {
        var that = this;
        var rank = [];
        var top_three = [];
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
                if (i <= 2) {
                    top_three.push(temp);
                }
                rank.push(temp);
            })
            wx.setStorage({
                data: rank,
                key: 'rank',
            })
            wx.setStorageSync('myRank', myRank);
            that.setData({
                myRank,
                top_three
            })
        }).catch(res => {
            console.log(res);
        })
    },
    //更新微信步数
    getStep: function () {
        var that = this;
        wx.login({
            success: function (resLonin) {
                wx.getWeRunData({
                    success: function (resRun) {
                        wx.cloud.callFunction({
                            name: 'wxStep',//云函数的文件名
                            data: {
                                weRunData: wx.cloud.CloudID(resRun.cloudID),
                                obj: {
                                    shareInfo: wx.cloud.CloudID(resRun.cloudID)
                                }
                            },
                            success: function (res) {
                                console.log("云函数接收到的数据")
                                let myStep = res.result.event.weRunData.data.stepInfoList[30].step;
                                that.setData({
                                    myStep
                                })
                                wx.setStorageSync('todayStep', that.data.myStep);
                                console.log("得到的今日步数：", that.data.myStep)
                            }
                        })
                    },
                })
            }
        })
    },

    //下拉刷新
    onPullDownRefresh: async function () {
        let userInfo = wx.getStorageSync('userInfo');
        let myStep = wx.getStorageSync('myStep');
        wx.getSetting({
            success: res => {
                if (!userInfo) {
                    wx.showToast({
                        title: '请先登录！',
                        icon: 'none',
                        mask: true,
                        fail: function () {
                            console.log("Toast失败！");
                        }
                    })
                } else if (!res.authSetting['scope.werun']) {
                    wx.showToast({
                        title: '请先授权获取微信步数！',
                        icon: 'none',
                        mask: true,
                        fail: function () {
                            console.log("Toast失败！");
                        }
                    })
                } else {
                    this.getStep();
                    this.getuserData();
                    this.getrank();
                    this.setData({
                        userInfo
                    })

                }
            }
        })

        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 300)

    }

})