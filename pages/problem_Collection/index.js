// pages/problem_Collection/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrong: null,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tiku_id = options.tiku_id;
    const that = this;

    wx.cloud.callFunction({
      name: 'gettiku',
      data: {
        ind: 'PROBLEMS'
      }
    }).then(res => {
      var wrong_list = res.result.data[0].problems;
      wrong_list.forEach((v, i) => {
        if (v.tiku_id == tiku_id) {
          that.setData({
            wrong: v.wrong_array,
          })
          console.log(v);
        }
      })
      console.log('得到错题--------');
    })
    setTimeout(() => {
      that.setData({
        loading: false
      })
    }, 1000);
  },

})