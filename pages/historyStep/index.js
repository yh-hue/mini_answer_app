// pages/historyStep/index.js

import * as echarts from '../../components/ec-canvas/echarts';
var stepArry = [];
var list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
var list2 = [1, 2, 3, 4, 5, 6, 7];

Page({
  data: {
    monthStep: {
      onInit: initChart
    },
    weekStep: {
      onInit: initWeekChart
    }
  },

  onShow() {
    var step = wx.getStorageSync('stepArry');
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    for (let i = 0; i < step.length; i++) {
      stepArry[i] = step[i].step
    }
    wx.hideLoading();
    console.log(stepArry);
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
function initChart(canvas, width, height) {
  var dpr = getPixelRatio();
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '近三十一日步数',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['近三十一日步数']
    },
    grid: {
      left: '1%',
      right: '30rpx',
      bottom: '1%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: list,
    },
    yAxis: {
      type: 'value',
      name: "步数",
    },
    series: [
      {
        name: '步数',
        type: 'line',
        data: stepArry,
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

function initWeekChart(canvas, width, height) {
  var dpr = getPixelRatio();
  var weekStepArry = [];
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  for (let i = 24; i <= 30; i++) {
    weekStepArry[i - 24] = stepArry[i];
  }
  console.log(weekStepArry);
  var option = {
    title: {
      text: '近七日步数',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['近七日步数']
    },
    grid: {
      left: '1%',
      right: '30rpx',
      bottom: '1%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: list2,
    },
    yAxis: {
      name: "步数",
    },
    series: [
      {
        name: '步数',
        type: 'line',
        color: 'skyblue',
        data: weekStepArry,
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }
    ]
  };

  chart.setOption(option);
  return chart;
}



