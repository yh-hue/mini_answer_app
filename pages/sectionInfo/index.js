
// pages/sectionInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    text: '',
    src: '',
    loading: true,
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.cloud.callFunction({
      name: 'upadteUserData',
      data: {
        page_id: options.page_id,
        ind: 'GETSECTION'
      }
    }).then(res => {
      setTimeout(() => {
        this.setData({
          title: res.result.data[0].title,
          text: res.result.data[0].text,
          src: res.result.data[0].src,
          loading: false,
          url: '/pages/single/index?tiku_id=' + options.page_id
        })
      }, 800)
    }).catch(erro => { console.log(erro); })
  },


})