// pages/setUserProductInfo/setUserProductInfo.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    time: '',
    monthList: [],
    monthPlanBarHeight: 0,
    planBarHeight: 0,
    productId: '',
    productName: '',
    mark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      // 产品ID
      productId: options.prodcutid,
      // 产品ID
      productName: options.prodcutname,
      // 获取全部零件或部分零件标记{part：部分；all：全部}
      mark: options.getTypt,
      listData: getListData(),
      // 获取当前时间，用于月份显示，只显示已经存在的月份
      monthList: getMonthList(),
      time: month + 1

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.planPie = this.selectComponent('#plan-pie');
    // this.planBar = this.selectComponent('#plan-bar');
    // this.monthPlanBar = this.selectComponent('#monthPlan-bar');
    this.init()
    this.setOptionPlanBar()
    this.setOptionMonthPlanBar()
  },
  goComponents(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/components/components?prodcutid=${id}&prodcutname=${name}&getTypt=all`
    })
  },
  selMonth(e) {
    if (this.data.time === e.currentTarget.dataset.month) {
      return ''
    }
    this.setData({
      time: e.currentTarget.dataset.month
    })
    this.setOptionMonthPlanBar()
    // this.monthPlanBar = this.selectComponent('#monthPlan-bar');
    // this.monthPlanBar.init((canvas, width, height) => {
    //   // 获取组件的 canvas、width、height 后的回调函数
    //   // 在这里初始化图表
    //   const chart = echarts.init(canvas, null, {
    //     width: width,
    //     height: height
    //   });
    //   setOptionMonthPlanBar(chart, this.data.time);
    //   // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    //   return chart;
    // });
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
      setOptionPlanPie(chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    // this.planBar.init((canvas, width, height) => {
    //   // 获取组件的 canvas、width、height 后的回调函数
    //   // 在这里初始化图表
    //   const chart = echarts.init(canvas, null, {
    //     width: width,
    //     height: height
    //   });
    //   setOptionPlanBar(chart);
    //   // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    //   return chart;
    // });
    // this.monthPlanBar.init((canvas, width, height) => {
    //   // 获取组件的 canvas、width、height 后的回调函数
    //   // 在这里初始化图表
    //   const chart = echarts.init(canvas, null, {
    //     width: width,
    //     height: height
    //   });
    //   setOptionMonthPlanBar(chart, time);
    //   // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    //   return chart;
    // });
  },
  setOptionPlanBar() {
    let chartData = [
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 },
      { "name": "零件1", "plan": 100, "schedule": 50 }
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
      remainderlist.push(chartData[i].schedule - chartData[i].plan)
    }
    let data = new Object();
    data.namelist = namelist;
    data.planlist = planlist;
    data.schedulelist = schedulelist;
    data.remainderlist = remainderlist;
    data.chartName = '各零件进度';
    // 计算图表显示高度
    this.setData({
      planBarHeight: 100 * chartData.length
    })
    this.planBar = this.selectComponent('#plan-bar');
    this.planBar.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      app.setUserBarShow(data, chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    // 图表渲染

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
  },
  setOptionMonthPlanBar() {
    let chartData = [
      { "name": "计划", "schedule": 100 },
      { "name": "累积", "schedule": 80 },
      { "name": "1号", "schedule": 20 },
      { "name": "2号", "schedule": 20 },
      { "name": "3号", "schedule": 20 },
      { "name": "4号", "schedule": 20 },
    ]
    let namelist = []
    let schedulelist = []
    let remainderlist = []
    let i = 0;
    for (i in chartData) {
      namelist.push(chartData[i].name)
      schedulelist.push(chartData[i].schedule)
    }
    let data = new Object();
    data.namelist = namelist;
    data.schedulelist = schedulelist;
    data.chartName = `${this.data.time}月进度`;
    // 计算图表显示高度
    this.setData({
      monthPlanBarHeight: 100 * chartData.length
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
    // 图表渲染

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
// 加载列表，数据展示
function getListData() {
  // name--产品名
  // id--产品ID
  // yearPlan--年计划
  // yearSchedule--年进度
  // monthPlan--月计划
  // monthSchedule--月进度
  let data = [
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
    { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 }
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
  let chartData = [
    { "name": "完成", "value": 100 },
    { "name": "剩余", "value": 30 }
  ]
  let data = new Object();
  data.chartData = chartData;
  data.chartName = '完成情况';
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


// 无用代码
// // 完成数据详情--柱
// function setOptionPlanBar(chart) {
//   let chartData = [
//     {"name": "零件1", "plan": 100, "schedule": 60},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 90},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 80},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 70},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 20},
//     {"name": "零件1", "plan": 100, "schedule": 30}
//   ]
//   let namelist = []
//   let planlist = []
//   let schedulelist = []
//   let remainderlist = []
//   let i = 0;
//   for (i in chartData) {
//     namelist.push(chartData[i].name)
//     planlist.push(chartData[i].plan)
//     schedulelist.push(chartData[i].schedule)
//     remainderlist.push(chartData[i].schedule - chartData[i].plan)
//   }
//   let data = new Object();
//   data.namelist = namelist;
//   data.planlist = planlist;
//   data.schedulelist = schedulelist;
//   data.remainderlist = remainderlist;
//   data.chartName = '各区进度';
//   // 图表渲染
//   app.barShow(data, chart)
//   // wx.request({
//   //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
//   //   method: 'POST',
//   //   data: {
//   //     userName: this.userName,
//   //     userPaw: this.userPaw
//   //   },
//   //   success: data => {
//   //     if (data.data.success) {
//   //       // data = data.data.novels

//   //     } else {
//   //       wx.showModal({
//   //         title: '',
//   //         content: data.data.errmsg
//   //       })
//   //     }
//   //   }
//   // })
// }
// // 完成数据详情--月份--柱
// function setOptionMonthPlanBar(chart) {
//   let chartData = [
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50},
//     {"name": "零件1", "plan": 100, "schedule": 50}
//   ]
//   let namelist = []
//   let planlist = []
//   let schedulelist = []
//   let remainderlist = []
//   let i = 0;
//   for (i in chartData) {
//     namelist.push(chartData[i].name)
//     planlist.push(chartData[i].plan)
//     schedulelist.push(chartData[i].schedule)
//     remainderlist.push(chartData[i].schedule - chartData[i].plan)
//   }
//   let data = new Object();
//   data.namelist = namelist;
//   data.planlist = planlist;
//   data.schedulelist = schedulelist;
//   data.remainderlist = remainderlist;
//   data.chartName = '各区进度';
//   // 图表渲染
//   app.barShow(data, chart)
//   // wx.request({
//   //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
//   //   method: 'POST',
//   //   data: {
//   //     userName: this.userName,
//   //     userPaw: this.userPaw
//   //   },
//   //   success: data => {
//   //     if (data.data.success) {
//   //       // data = data.data.novels

//   //     } else {
//   //       wx.showModal({
//   //         title: '',
//   //         content: data.data.errmsg
//   //       })
//   //     }
//   //   }
//   // })
// }