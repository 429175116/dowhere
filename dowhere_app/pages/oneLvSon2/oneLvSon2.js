// pages/oneLvSon2/oneLvSon2.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // listData: [],
    time: '',
    monthList: [],
    monthPlanBarHeight: 0,
    planBarHeight: 0,
    productId: '',
    productName: '',
    mark: '',
    productInfo: null,
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      // 产品ID
      productId: options.id,
      // 获取当前时间，用于月份显示，只显示已经存在的月份
      monthList: getMonthList(),
      time: month + 1
    })
    this.getPartsInfo(options.id)
  },
  // 获取零件详情信息
  getPartsInfo(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/one_parts`,
      method: 'POST',
      data: {
        parts_id: id
      },
      success: data => {
        if (data.data.code == 1) {
          this.setData({
            productInfo: data.data.data
          })
          // 获取零件的完成情况--饼图
          this.getOptionPlanPie(this.data.productInfo.id)
          // 显示柱状图
          this.HistogramData(this.data.productInfo.id)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  // 获取零件的全年完成情况--饼图
  getOptionPlanPie(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/circle`,
      method: 'POST',
      data: {
        parts_id: id
      },
      success: data => {
        if (data.data.code === '1') {
          data = data.data.data
          let remaining = parseInt(data.year_plan_bout) - parseInt(data.year_fulfil_bout)
          let chartData = [
            { "name": "完成", "value": parseInt(data.year_fulfil_bout) },
            { "name": "剩余", "value": parseInt(remaining) }
          ]
          // 计划完成度--饼
          this.setOptionPlanPie(chartData)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  HistogramData(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/one_Histogram`,
      method: 'POST',
      data: {
        parts_id: id,
        month: this.data.time
      },
      success: data => {
        if (data.data.code === '1') {
          let dayData = data.data.data
          // plan 计划
          // remaining 剩余
          // complete 完成
          var chartData = {
            "plan": data.data.data.month_plan,
            "remaining": 0,
            "complete": 0,
            "day": []
          }
          dayData = dayData.month_fulfil
          let i = 0
          for (i in dayData) {
            chartData.complete += dayData[i].month_fulfil
            chartData['day'].push({ "name": `${dayData[i].day}号`, "schedule": dayData[i].month_fulfil })
          }
          if (chartData.plan >= chartData.complete) {
            chartData.remaining = chartData.plan - chartData.complete
          }
          // 各月完成--柱
          this.setOptionMonthPlanBar(chartData)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
    this.setOptionMonthPlanBar()
  },
  // 计划完成度--饼
  setOptionPlanPie(chartData) {
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '完成情况';
    // 图表渲染
    this.planPie = this.selectComponent('#plan-pie');
    this.planPie.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      app.pieShow(data, chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  selMonth(e) {
    this.setData({
      // 初始化图表容器高度
      monthPlanBarHeight: 'auto',
      time: e.currentTarget.dataset.month
    })
    this.HistogramData(this.data.productInfo.id)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  setOptionMonthPlanBar(chartData) {
    let namelist = []
    let schedulelist = []
    let remainderlist = []
    let i = 0;
    let dayData = chartData.day
    for (i in dayData) {
      namelist.push(dayData[i].name)
      schedulelist.push(dayData[i].schedule)
    }
    let data = new Object();
    data.plan = chartData.plan
    data.remaining = chartData.remaining
    data.complete = chartData.complete
    data.namelist = namelist;
    data.schedulelist = schedulelist;
    data.chartName = `${this.data.time}月进度`;
    // 计算图表显示高度
    let k = 300
    if (chartData.length < 10) {
      k = 300
    } else if (chartData.length < 5) {
      k = 300
    }
    this.setData({
      monthPlanBarHeight: k * chartData.length + 500
    })
    this.monthPlanBar = this.selectComponent('#monthPlan-bar');
    this.monthPlanBar.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      app.monthBarShow(data, chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  }
})
// 获取月份列表
function getMonthList() {
  // 获取当前时间，用于月份显示，只显示已经存在的月份
  //获取当前月份(0-11,0代表1月)
  var date = new Date();
  let month = date.getMonth()
  let i = 0;
  let monthList = []
  for (let i = 0; i <= month; i++) {
    monthList.push({ "monthName": `${i + 1}月`, "month": i + 1 })
  }
  return monthList
}
