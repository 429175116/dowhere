// pages/productInfo/productInfo.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    time: '3',
    monthList:[
      {"monthName": "1月", "month": "1"},
      {"monthName": "2月", "month": "2"},
      {"monthName": "3月", "month": "3"},
      {"monthName": "4月", "month": "4"},
      {"monthName": "5月", "month": "5"},
      {"monthName": "6月", "month": "6"},
      {"monthName": "7月", "month": "7"},
      {"monthName": "8月", "month": "8"},
      {"monthName": "9月", "month": "9"},
      {"monthName": "10月", "month": "10"},
      {"monthName": "11月", "month": "11"},
      {"monthName": "12月", "month": "12"}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      listData: getListData()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.planPie = this.selectComponent('#plan-pie');
    this.planBar = this.selectComponent('#plan-bar');
    this.monthPlanBar = this.selectComponent('#monthPlan-bar');
    this.init()
  },
  goPlan(e) {
    // 进入计划页
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/setPlan/setPlan?id=${id}`
    })
  },
  goSchedule(e) {
    // 进入进度录入页
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/setSchedule/setSchedule?id=${id}`
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  init(time) {
    this.planPie.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionPlanPie(chart, time);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    this.planBar.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionPlanBar(chart, time);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    this.monthPlanBar.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionMonthPlanBar(chart, time);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  }
})
// 加载列表，数据展示
function getListData() {
  // name--产品名
  // id--产品ID
  // yearPlan--年计划
  // yearSchedule--年进度
  // monthPlan--月计划
  // monthSchedule--月进度
  let data = [
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50},
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50},
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50},
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50},
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50},
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50},
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50},
    {"name": "产品1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50}
  ]
  return data
  // wx.request({
  //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
  //   method: 'POST',
  //   data: {
  //     userName: this.userName,
  //     userPaw: this.userPaw
  //   },
  //   success: data => {
  //     if (data.data.success) {
  //       // data = data.data.novels
        
  //     } else {
  //       wx.showModal({
  //         title: '',
  //         content: data.data.errmsg
  //       })
  //     }
  //   }
  // })
}
// 计划完成度--饼
function setOptionPlanPie(chart) {
  let data = [
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品3", "value": 80},
  ]
  // 图表渲染
  app.pieShow(data, chart)
  // wx.request({
  //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
  //   method: 'POST',
  //   data: {
  //     userName: this.userName,
  //     userPaw: this.userPaw
  //   },
  //   success: data => {
  //     if (data.data.success) {
  //       // data = data.data.novels
        
  //     } else {
  //       wx.showModal({
  //         title: '',
  //         content: data.data.errmsg
  //       })
  //     }
  //   }
  // })
}

// 完成数据详情--柱
function setOptionPlanBar(chart) {
  let chartData = [
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50}
  ]
  let namelist = []
  let planlist = []
  let schedulelist = []
  let remainderlist = []
  let i = 0;
  for (i in chartData) {
    namelist.push(chartData[i].name)
    planlist.push(chartData[i].plan)
    schedulelist.push(chartData[i].schedule)
    remainderlist.push(chartData[i].remainder)
  }
  let data = new Object();
  data.namelist = namelist;
  data.planlist = planlist;
  data.schedulelist = schedulelist;
  data.remainderlist = remainderlist;
  // 图表渲染
  app.barShow(data, chart)
  // wx.request({
  //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
  //   method: 'POST',
  //   data: {
  //     userName: this.userName,
  //     userPaw: this.userPaw
  //   },
  //   success: data => {
  //     if (data.data.success) {
  //       // data = data.data.novels
        
  //     } else {
  //       wx.showModal({
  //         title: '',
  //         content: data.data.errmsg
  //       })
  //     }
  //   }
  // })
}
// 完成数据详情--月份--柱
function setOptionMonthPlanBar(chart) {
  let chartData = [
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
    {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50}
  ]
  let namelist = []
  let planlist = []
  let schedulelist = []
  let remainderlist = []
  let i = 0;
  for (i in chartData) {
    namelist.push(chartData[i].name)
    planlist.push(chartData[i].plan)
    schedulelist.push(chartData[i].schedule)
    remainderlist.push(chartData[i].remainder)
  }
  let data = new Object();
  data.namelist = namelist;
  data.planlist = planlist;
  data.schedulelist = schedulelist;
  data.remainderlist = remainderlist;
  // 图表渲染
  app.barShow(data, chart)
  // wx.request({
  //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
  //   method: 'POST',
  //   data: {
  //     userName: this.userName,
  //     userPaw: this.userPaw
  //   },
  //   success: data => {
  //     if (data.data.success) {
  //       // data = data.data.novels
        
  //     } else {
  //       wx.showModal({
  //         title: '',
  //         content: data.data.errmsg
  //       })
  //     }
  //   }
  // })
}