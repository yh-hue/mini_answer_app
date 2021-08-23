
// pages/myInfo/index.js
var Name = null;
var department = null;
var id = null;
var index = null;
var de_class = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: null,
    Name: '',
    //department: '',
    id: '',
    de_class: '',
    index: null,
    mask_style: 'none',
    // array: ['交通运输工程学院', '土木工程学院', '汽车与机械工程学院', '水利工程学院',
    //   '交通运输工程学院', '土木工程学院', '汽车与机械工程学院', '水利工程学院',
    //   '电气与信息工程学院', '能源与动力工程学院', '经济与管理学院', '计算机与通信工程学院、移动互联网',
    //   '化学与食品工程学院', '数学与统计学院', '物理与电子科学学院', '材料科学与工程学院',
    //   '建筑学院', '马克思主义学院', '文学与新闻传播学院', '法学院',
    //   '外国语学院', '设计艺术学院', '体育学院', '国际学院',
    //   '创新创业教育学院(工程训练中心)', '城南学院', '继续教育学'
    // ],

  },


  //设置用户信息
  handleSetting() {
    this.setData({
      mask_style: 'block'
    })

  },

  //选择学院
  bindPickerChange(e) {
    var ind = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: ind
    })
    index = ind;
    department = this.data.array[index];
  },
  TimeId: -1,
  //获取用户输入的名字
  handleNameInput(e) {
    const value = e.detail.value;
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      if (!value.trim()) {
        wx.showToast({
          title: '姓名之间不要加空格噢~',
          icon: 'none',
          mask: true,
        })
        //值不合法
        return;
      }

    }, 500);
    //value不为空
    if (value) {
      Name = value;
    }
  },

  //获取用户输入的学号
  handleIdInput(e) {
    const value = e.detail.value;
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      if (!value.trim()) {
        wx.showToast({
          title: '学号之间不要加空格噢~',
          icon: 'none',
          mask: true,
        })
        //值不合法
        return;
      }
    }, 500);
    //value不为空
    if (value) {
      id = value;
    }

  },
  //获取班级信息
  handleclassInput(e) {
    const value = e.detail.value;
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      if (!value.trim()) {
        wx.showToast({
          title: '不要加空格噢~',
          icon: 'none',
          mask: true,
        })
        //值不合法
        return;
      }
    }, 500);
    //value不为空
    if (value) {
      de_class = value;
    }
  },
  TimeId: -1,
  //提交用户信息
  handleSubmit() {
    if (Name == null) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        mask: true
      })
      return
    }
    if (id == null) {
      wx.showToast({
        title: '请输入学号',
        icon: 'none',
        mask: true
      })
      return
    }
    if (de_class == null) {
      wx.showToast({
        title: '请输入专业班级',
        icon: 'none',
        mask: true
      })
      return
    }

    wx.cloud.callFunction({
      name: 'perfect_userInfo',
      data: {
        Name: Name,
        department: de_class,
        id: id
      }
    })
    this.setData({
      mask_style: 'none',
      index,
      Name,
      de_class,
      id
    })

    wx.showToast({
      title: '修改成功',
      icon: 'success',
      mask: true
    });
    this.TimeId = setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      }).then(res=>{
        var page = getCurrentPages().pop();
		    if (page == undefined || page == null) return; 
		    page.onPullDownRefresh(); 
      })
    }, 1000)
  },
  //取消提交
  handleCancel() {
    this.setData({
      mask_style: 'none'
    })
  },
  onShow() {
    var userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo);
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        mask: true
      }, 2000)
    } else {
      this.setData({
        nickName: userInfo.nickName,
        Name: userInfo.Name,
        de_class: userInfo.department,
        id: userInfo.id
      })
    }
  }
})