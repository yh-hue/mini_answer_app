// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [],
    text: ''
  },
  //外网图片路径数组
  Upload_img: [],
  //选择图片
  handleChoose() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          //图片数组进行拼接
          img_url: [...this.data.img_url, ...res.tempFilePaths]
        })
      },
    })
  },
  //删除图片
  handleDelete(e) {
    const index = e.currentTarget.dataset.index;
    let img_url = this.data.img_url;
    img_url.splice(index, 1);
    this.setData({
      img_url
    })
  },
  //获取文本框中内容
  handleTextInput(e) {
    const text = e.detail.value;
    this.setData({
      text
    })
  },
  //提交数据
  handleSubmit() {
    const text = this.data.text;
    const img_url = this.data.img_url;
    if (!text.trim()) {
      //不合法
      wx.showToast({
        title: '输入不合法!',
        icon: "none",
        mask: true
      })
      return;
    }
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });
    if (img_url.length != 0) {
      img_url.forEach((v, i) => {
        wx.cloud.uploadFile({
          cloudPath:"feedback_Image/"+Date.now()+".jpg",
          filePath:v
        }).then(res=>{
              console.log(res);
              console.log("把文本的内容和外网的图片数组提交到后台");
              this.setData({
                img_url: [],
                text: ''
              })
        }).catch(erro=>{
          console.log(erro)
        wx.hideLoading()
        wx.showToast({
          title:"图片上传失败，请检查网络！",
          icon:"none",
          duration:2000
        })
        })
      })
    } ;
    wx.hideLoading();
    wx.showToast({
      title: '上传成功',
      icon:'success',
      mask:true
    });
    this.TimeId = setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    },1000)

  },
})