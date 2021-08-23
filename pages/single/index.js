// pages/single/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        timu: null,//当前题目信息
        index_show: 0,//当前为哪道题目
        length: 0,//该题库题目总数
        user_choose: [],
        tiku_id: 0,//选择哪个题库
        mask_style: 'none',
        accuracy: 0,//正确率
        level: '不及格',//水平
        right: 0,//正确数目
        score: 0,//分数
        timer: 0,//倒计时
        countDownNum: '15',
        //题库编号
        tiku: ['658e9e57608433bf0acaa8f15cff7935', '658e9e57608433ed0acaa909576b8627', '658e9e576084341a0acaa90a39ab23c2', '658e9e57608434470acaa90b4e3d59e9',
            '5b00f97060843460086105f14b29b49b', '658e9e57608434800acaa90c2b17dfb1',
            '658e9e57608434a20acaa90d18910bca', '658e9e57608434c40acaa91455d83aaa',
            '658e9e57608434e70acaa9153eef66c0', '658e9e57608435090acaa91616f77f32',]
    },
    Timeid: -1,
    onLoad(options) {
        this.Timeid = new setTimeout(() => {
            this.getTimu();
        }, 1000)
        clearTimeout(this.Timeid);
        this.setData({
            tiku_id: options.tiku_id
        })
    },
    onShow() {
        this.countDown();
    },
    onUnload: function () {
        console.log('清除计时器');
        clearInterval(this.data.timer)
    },
    flag: 0,//倒计时处判断是否到达最后一题的标志
    //倒计时函数
    countDown() {
        let that = this;
        let countDownNum = that.data.countDownNum;//获取倒计时初始值
        console.log('倒计时开始');
        var timer = setInterval(function () {
            //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
            if (countDownNum == 0) {
                //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
                clearInterval(that.data.timer);
                if (that.data.length > that.flag + 1) {
                    that.radioChange();
                    that.handleForward();
                    countDownNum = '15';
                    that.setData({
                        countDownNum,
                    })
                    that.onShow();
                }
                else {
                    that.submit();
                }
            } else {
                countDownNum--;
                that.setData({
                    countDownNum: countDownNum
                })
            }
        }, 1000);
        that.setData({
            timer
        })
    },
    //读取题库
    async getTimu() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        var that = this;
        var tiku = that.data.tiku[that.data.tiku_id];
        await wx.cloud.callFunction({
            name: 'gettiku',
            data: {
                tiku,
                ind: 'TIKU'
            }
        }).then(res => {
            let timu_Array = [];
            let length = 0;
            //将得到的json对象转为数组
            for (var v in res.result.data) {
                if (length > 0)
                    timu_Array.push(res.result.data[v]);
                length++;
            }
            console.log(timu_Array);
            console.log(length);
            length -= 1;
            wx.setStorageSync('timu_Array', timu_Array);
            this.setData({
                timu: timu_Array,
                index_show: 0,
                length
            })
        })
        wx.hideLoading({})
    },
    // 单选获取用户所选的答案
    radioChange(e) {
        console.log(e);
        var user_choose = this.data.user_choose;
        var index_show = this.data.index_show;
        if (e) {
            user_choose[index_show] = e.detail.value;
        } else {
            if (user_choose[index_show] == null)
                user_choose[index_show] = ' ';
        }
        this.setData({
            user_choose
        })
        console.log(user_choose);
    },
    // 多选获取用户所选的答案
    boxChange(e) {
        console.log(e);
        var user_choose = this.data.user_choose;
        var index_show = this.data.index_show;
        if (e) {
            let temp = { 'A': '', 'B': '', 'C': '', 'D': '' }
            e.detail.value.forEach(v => {
                if (v == 'A') temp.A = v;
                else if (v == 'B') temp.B = v;
                else if (v == 'C') temp.C = v;
                else temp.D = v;
            })
            user_choose[index_show] = temp;
        } else {
            if (user_choose[index_show] == null)
                user_choose[index_show] = ' ';
        }
        this.setData({
            user_choose
        })
        console.log(user_choose);
    },
    //下一题
    handleForward() {
        //var timu_Array= wx.getStorageSync('timu_Array');
        clearInterval(this.data.timer);
        var index_show = this.data.index_show + 1;
        this.flag++;
        console.log(this.flag);
        if (index_show == this.data.length) {
            index_show--;
        }
        this.setData({
            //timu:timu_Array[index_show],
            countDownNum: '15',
            index_show
        })
        this.onShow();
    },
    //上一题
    handleBack() {
        //var timu_Array= wx.getStorageSync('timu_Array');
        var index_show = this.data.index_show - 1;
        this.setData({
            // timu:timu_Array[index_show],
            index_show
        })
    },
    //提交答案
    submit() {
        let right = 0;
        let level = '';
        let accuracy = 0;
        let score = 0;
        let user_choose = this.data.user_choose;
        let timu = this.data.timu;
        let wrong = { 'tiku_id': 0, 'wrong_array': [] };
        wrong.tiku_id = this.data.tiku_id;
        user_choose.forEach((v, i) => {
            if (timu[i].type == '0') {
                if (('正确答案:' + v) === timu[i].answer)
                    right++;
                else {
                    wrong.wrong_array.push(timu[i]);
                }
            } else {
                if ('正确答案:' + v.A + v.B + v.C + v.D === timu[i].answer)
                    right++;
                else {
                    wrong.wrong_array.push(timu[i]);
                }
            }
        })
        accuracy = (right / user_choose.length * 100).toFixed(2);
        score = accuracy;
        if (accuracy >= 90)
            level = '优秀'
        else if (accuracy >= 80) {
            level = '良好'
        }
        else if (accuracy >= 60) {
            level = '及格'
        } else {
            level = '不及格'
        }
        let section_info = null;//用户是否为第一次答题，0为第一次
        let section_credit = null;//用户第一次答题所得积分
        let total_credit = 0;//用户总积分
        let step_credit = 0;//用户兑换步数
        let answer_credit = 0;//用户答题所得总积分
        //读取用户积分信息
        wx.cloud.callFunction({
            name: 'upadteUserData',
            data: {
                ind: 'GET_CREDIT'
            }
        }).then(res => {
            console.log(res);
            section_info = res.result.data[0].section_info;
            section_credit = res.result.data[0].section_credit;
            total_credit = res.result.data[0].total_credit;
            step_credit = res.result.data[0].step_credit;
            answer_credit = res.result.data[0].answer_credit;
            if (section_info[wrong.tiku_id] < 3) {
                section_info[wrong.tiku_id] += 1;
                total_credit = parseFloat((total_credit - section_credit[wrong.tiku_id] + right * 10).toFixed(2));
                answer_credit = parseFloat((answer_credit - section_credit[wrong.tiku_id] + right * 10).toFixed(2));
                section_credit[wrong.tiku_id] = parseFloat((right * 10).toFixed(2));
                //更新用户错题记录
                wx.cloud.callFunction({
                    name: 'upadteUserData',
                    data: {
                        wrong: wrong,
                        ind: 'WRONG'
                    }
                })
                //更新用户积分信息
                wx.cloud.callFunction({
                    name: 'upadteUserData',
                    data: {
                        section_info: section_info,
                        section_credit: section_credit,
                        step_credit: step_credit,
                        total_credit: total_credit,
                        answer_credit: answer_credit,
                        ind: 'UP_CREDIT'
                    }
                })
            }
        });


        this.setData({
            mask_style: "block",
            level,
            score,
            right,
            accuracy
        })
    },
    //隐藏提交成功提示页面
    handleconfirm() {
        this.setData({
            mask_style: "none"
        })
        // clearInterval(this.data.timer)
        wx.switchTab({
            url: '/pages/myroute/index'
        })
    },
})