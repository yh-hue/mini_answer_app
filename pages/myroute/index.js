var index = '';
Page({
    data: {
        scrollTop: 0,
        mask_style: 'none',
        ask_mask1: 'none',
        ask_mask2: 'none',
        ind: 0,//对应章节的编号
        userInfo: null,
        myRank: '未上榜',
        usedStep: 0,//今日已兑换步数
        myStep: 0,//今日总步数
        useableStep: 0,//今日可用步数
        DH_step: 0,//可兑换里程
        totalDistance: 0,//总里程
        totalDay: 0,//总天数
        last_DH_day: 0,//记录用户上一次一次兑换里程的时间
        special_list: '',
        currentLevel: '一',
        currentLevelName: '建党伟业',
        page_id: 0,
        section_info: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//各章节答题次数
        need: 0,
        have: 0,
        complete: false
    },
    special_list: [
        {
            title: '一、 建党伟业',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/dKL4ONskPuB1n25.png',
            isactive: true
        }, {
            title: '二、土地革命',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/mjU8kHAhSPtrCeF.png',
            isactive: false
        }, {
            title: '三、全民族抗日战争',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/ZKGodjzuq6nWlfx.png',
            isactive: false
        }, {
            title: '四、新民主主义革命胜利',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/h7eSI3BQUgjAPOo.png',
            isactive: false

        }, {
            title: '五、建国大业',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/qvCtQIciFZkYlwy.png',
            isactive: false

        }, {
            title: '六、社会主义建设的曲折探索',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/lc2GIApQ9jYaNdr.png',
            isactive: false
        }, {
            title: '七、伟大转折',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/L8iPrNkwUCFZBlK.png',
            isactive: false
        }, {
            title: '八、世纪之光',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/9Ate6M2HhJUlLIr.png',
            isactive: false
        }, {
            title: '九、稳步前进',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/LelKkP2DScFm1CG.png',
            isactive: false
        }, {
            title: '十、走进新时代',
            url: '#',
            src: 'https://i.loli.net/2021/04/19/sTRyrUD491MC8VN.png',
            isactive: false
        },
    ],

    handleAswer(e) {
        index = e.currentTarget.dataset.index;
        var section_info = this.data.section_info;
        console.log(index);
        if (section_info[index] < 3) {
            this.setData({
                ask_mask1: 'block',
                ind: index
            })
        } else {
            this.setData({
                ask_mask2: 'block',
                ind: index
            })
        }
    },
    handleAsk_confirm() {
        var that = this;
        this.setData({
            ask_mask1: 'none',
            ask_mask2: 'none'
        })
        wx.navigateTo({
            url: '/pages/sectionInfo/index?page_id=' + index,
        }).then(res => {
            res.eventChannel.emit({ page_id: that.data.index })
        })

    },
    handleAsk_Cancle() {
        this.setData({
            ask_mask1: 'none',
            ask_mask2: 'none'
        })
    },
    handleHint() {
        wx.showToast({
            title: '您目前还未解锁该章节,继续加油！',
            icon: 'none',
            duration: 1000
        })
    },

    //兑换里程
    async handleDH() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        let myStep = this.data.myStep;//今日总步数
        let usedStep = this.data.usedStep;//今日已兑换步数
        let useableStep = this.data.useableStep;//今日可用步数
        let DH_step = this.data.DH_step;//可兑换里程
        let totalDistance = this.data.totalDistance;//总里程
        let totalDay = this.data.totalDay;//总天数
        let last_DH_day = this.data.last_DH_day;
        let date = new Date();
        usedStep = myStep;//当天每次兑换步数时，结果为当天最大步数
        totalDistance = parseFloat((totalDistance + useableStep / 200).toFixed(2));//每次兑换时，总里程等于原来的加上本次可兑换的步数，限制两位小数

        //先将原来的积分读取出来，然后更新之后再重新设置回去
        let section_info = null;//用户是否为第一次答题，0为第一次
        let section_credit = null;//用户第一次答题所得积分
        let total_credit = 0;//用户总积分
        let step_credit = 0;//用户兑换步数
        setTimeout(() => {
            //读取用户积分信息
            wx.cloud.callFunction({
                name: 'upadteUserData',
                data: {
                    ind: 'GET_CREDIT'
                }
            }).then(res => {
                section_info = res.result.data[0].section_info;
                section_credit = res.result.data[0].section_credit;
                total_credit = parseFloat((res.result.data[0].total_credit + (useableStep / 200)).toFixed(2));
                step_credit = totalDistance;
                //更新用户积分信息，这里其实只会更新我们的路程积分
                wx.cloud.callFunction({
                    name: 'upadteUserData',
                    data: {
                        section_info: section_info,
                        section_credit: section_credit,
                        step_credit: step_credit,
                        total_credit: total_credit,
                        ind: 'UP_CREDIT'
                    }
                })
            });

            if (last_DH_day != 0) {//不是第一天兑换步数
                let day = (date.getDate() - last_DH_day);
                // 不是同一天兑换
                if (day != 0) {
                    totalDay += 1;
                    wx.cloud.callFunction({
                        name: 'upadteUserData',
                        data: {
                            usedStep: usedStep,
                            totalDistance: totalDistance,
                            totalDay: totalDay,
                            last_DH_day: date.getDate(),
                            ind: 'DH'
                        }
                    })
                } else {//同一天内兑换,总天数不变
                    wx.cloud.callFunction({
                        name: 'upadteUserData',
                        data: {
                            usedStep: usedStep,
                            totalDistance: totalDistance,
                            ind: 'DH'
                        }
                    })
                }
            } else {//第一天兑换步数
                totalDay = 1;
                last_DH_day = date.getDate();
                console.log(last_DH_day);
                wx.cloud.callFunction({
                    name: 'setUserData',
                    data: {
                        usedStep: usedStep,
                        totalDistance: totalDistance,
                        totalDay: totalDay,
                        last_DH_day: last_DH_day,
                    }
                })
            }
            this.check();
            this.setData({
                usedStep,
                myStep,
                useableStep: 0,
                DH_step: 0,
                totalDistance,
                totalDay,
                last_DH_day,
                mask_style: "block"
            });
            wx.setStorageSync('usedStep', usedStep);
            wx.hideLoading({});
        }, 1200)

    },

    //隐藏兑换成功提示页面
    handleconfirm() {
        this.setData({
            mask_style: "none"
        })
    },

    TimeId: -1,
    onShow: function () {
        var that = this;
        let userInfo = wx.getStorageSync('userInfo');
        var myRank = wx.getStorageSync('myRank');
        if (myRank)
            this.setData({
                myRank
            })
        //判断用户是否授权微信步数，是否登录，若都满足则获取数据
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
                    that.getStep();//获取微信步数
                    that.check();//检查用户是否信息存在，若存在则从云端读取
                    this.TimeId = setTimeout(() => {
                        let usedStep = wx.getStorageSync('usedStep');//今日已兑换步数
                        let myStep = wx.getStorageSync('todayStep');//今日总步数
                        let useableStep = myStep - usedStep//今日可用步数
                        if (useableStep < 0) useableStep = 0;
                        let DH_step = 0;
                        DH_step = (useableStep / 200).toFixed(2);
                        wx.setStorageSync('useableStep', useableStep);
                        that.setData({
                            userInfo,
                            useableStep,
                            DH_step,
                            myStep,
                        })

                    }, 1200)

                }
            }
        })
    },

    //判断用户数据是否已经存在,若存在则读取云端数据
    async check() {
        var that = this;
        var total_credit = 0;
        var section_info = [];
        //获取用户步数信息
        await wx.cloud.callFunction({
            name: 'check'
        }).then(res => {
            if (res.result.data.length !== 0) {
                console.log('用户存在,开始读取云端数据---');
                console.log(res);
                // 将得到的数据设置到data里面
                that.setData({
                    usedStep: res.result.data[0].usedStep,
                    totalDay: res.result.data[0].totalDay,
                    totalDistance: res.result.data[0].totalDistance,
                    last_DH_day: res.result.data[0].last_DH_day,
                });
                wx.setStorageSync('usedStep', res.result.data[0].usedStep);
            }
            else {
                console.log('用户还未兑换过步数！');
                wx.setStorageSync('usedStep', 0);
            }
        }).catch(console.error);

        //获取用户积分信息
        await wx.cloud.callFunction({
            name: 'upadteUserData',
            data: {
                ind: 'GET_CREDIT'
            }
        }).then(res => {
            //计算积分
            total_credit = res.result.data[0].total_credit;
            //获取章节答题次数
            section_info = res.result.data[0].section_info;
            let need = 0;//计算解锁下一章所需积分
            let have = 0;
            //计算解锁的关卡
            let i = parseInt(total_credit / 100);
            console.log(total_credit, i);
            let special_list = that.special_list;
            let currentLevel = '';
            let currentLevelName = '';
            let page_id = 0;
            let complete = that.data.complete;
            special_list.forEach((v, ind) => {
                if (ind <= i) {
                    v.isactive = true;
                    v.url = '/pages/single/index?tiku_id=' + ind;
                    if (ind == i) {
                        if (i == 0) {
                            need = (100 - total_credit).toFixed(2);
                        } else {
                            need = (100 * (i + 1) - total_credit).toFixed(2);
                        }
                        have = (100 - need).toFixed(2);
                        currentLevel = v.title.substr(0, 1);
                        currentLevelName = v.title.substring(2, 30);
                        page_id = ind;
                    } else if (i > 9) {
                        currentLevel = '十';
                        currentLevelName = '走进新时代';
                        complete = true;
                        page_id = 9;
                    }

                } else {
                    v.isactive = false;
                    v.url = '#'
                }
            })

            that.setData({
                special_list,
                currentLevel,
                currentLevelName,
                page_id,
                section_info,
                need,
                have,
                special_list: that.special_list,
                complete
            })
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

    // 下拉刷新
    onPullDownRefresh: async function () {
        var that = this;
        let userInfo = wx.getStorageSync('userInfo');
        //判断用户是否授权微信步数，是否登录，若都满足则获取数据
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
                    that.getStep();
                    //检查用户是否信息存在，若存在则从云端读取
                    that.check();
                    this.TimeId = setTimeout(() => {

                        let usedStep = wx.getStorageSync('usedStep');//今日已兑换步数
                        let myStep = wx.getStorageSync('todayStep');//今日总步数
                        console.log(usedStep);
                        console.log(myStep);
                        let useableStep = myStep - usedStep//今日可用步数
                        let DH_step = 0;
                        DH_step = (useableStep / 200).toFixed(2);
                        wx.setStorageSync('useableStep', useableStep);
                        that.setData({
                            userInfo,
                            useableStep,
                            DH_step,
                            myStep,
                        })

                    }, 1000)

                }
            }
        })

        var myRank = wx.getStorageSync('myRank');
        if (myRank)
            this.setData({
                myRank
            });
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 300)
    },

})

