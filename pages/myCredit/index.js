// pages/myCredit/index.js
import * as echarts from '../../components/ec-canvas/echarts';
var list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var section_credit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    credit: {
      onInit: initCreditChart
    },
    step_credit: 0,
    answer_credit: 0,
    total_credit: 0,
    loading: true
  },

  async onShow() {
    var that = this;
    var answer_credit = 0;
    await wx.cloud.callFunction({
      name: 'upadteUserData',
      data: {
        ind: 'GET_CREDIT'
      }
    }).then(res => {
      section_credit = res.result.data[0].section_credit;
      section_credit.forEach(v => {
        answer_credit += v;
      })
      that.setData({
        step_credit: res.result.data[0].step_credit,
        answer_credit,
        total_credit: res.result.data[0].total_credit,
      })
    })
    setTimeout(() => {
      that.setData({
        loading: false
      })
    }, 800);
  }


})
//获取设备像素参数
function getPixelRatio() {
  let pixelRatio = 0
  wx.getSystemInfo({
    success: function (res) {
      pixelRatio = res.pixelRatio
    },
    fail: function () {
      pixelRatio = 0
    }
  })
  return pixelRatio
}

//初始化表格
function initCreditChart(canvas, width, height) {
  setTimeout(() => {
    var dpr = getPixelRatio();
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr
    });
    console.log(section_credit);
    canvas.setChart(chart);
    var option = {
      title: {
        text: '各章节答题得分',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['得分']
      },
      grid: {
        left: '1%',
        right: '30rpx',
        bottom: '1%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: list,
      },
      yAxis: {
        type: 'value',
        name: "得分",
      },
      series: [
        {
          name: '得分',
          type: 'bar',
          barWidth: '60%',
          color: 'skyblue',
          data: section_credit
        }
      ]
    };


    chart.setOption(option);
    return chart;
  }, 1000);

}