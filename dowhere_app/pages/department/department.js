// pages/department/department.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      listData: getListData()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.planPie = this.selectComponent('#plan-pie');
    this.planBar = this.selectComponent('#plan-bar');
    this.init()
  },
  goProdcutInfo(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/productInfo/productInfo?id=${id}`
    })
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
  // let i = 0
  // for () {

  // }
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