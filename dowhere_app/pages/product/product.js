// pages/product/product.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    planBarHeight: 0,
    projectListData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let projectListData = [
      {"projectName": "加一","id": "1"},
      {"projectName": "加二","id": "2"},
      {"projectName": "加三","id": "3"}
    ]
    // this.setData({
    //   projectListData: projectListData
    // })
    this.setData({
      lv: options.lv,
      projectListData: projectListData,
      listData: getListData()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.quantityPie = this.selectComponent('#quantity-pie');
    this.planPie = this.selectComponent('#plan-pie');
    // this.planBar = this.selectComponent('#plan-bar');
    this.init()
    this.setOptionPlanBar()
  },
  goProdcutInfo(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/productInfo/productInfo?prodcutid=${id}&prodcutname=${name}&getTypt=all`
    })
  },
  goProduct() {
    wx.navigateTo({
      url: `/pages/department/department`
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
  // 点击按钮后初始化图表
  init(time) {
    if (this.data.lv == "1" || this.data.lv == "3") {
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
    }
    
    if (this.data.lv == "1" || this.data.lv == "2") {
      this.quantityPie.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setQuantityPie(chart, time);
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
    }
  },
  setOptionPlanBar() {
    let chartData = []
    if(this.data.lv == '1') {
      chartData = [
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "加一", "plan": 100, "schedule": 50},
        {"name": "加二", "plan": 100, "schedule": 50},
        {"name": "加三", "plan": 100, "schedule": 50}
      ]
    } else if (this.data.lv == '2') {
      chartData = [
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50},
        {"name": "产品1", "plan": 100, "schedule": 50}
      ]
    } else if (this.data.lv == '3') {
      chartData = [
        {"name": "加一", "plan": 100, "schedule": 50},
        {"name": "加二", "plan": 100, "schedule": 50},
        {"name": "加三", "plan": 100, "schedule": 50}
      ]
    }
    
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
    data.chartName = '产品进度';
    // 计算图表显示高度
    let k = 100
    if (chartData.length < 10) {
      k = 150
    } else if (chartData.length < 5) {
      k = 200
    }
    this.setData({
      planBarHeight: k * chartData.length
    })
    this.planBar = this.selectComponent('#plan-bar');
    this.planBar.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      app.barShow(data, chart)
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
  let chartData = [
    {"name": "加一", "value": 100},
    {"name": "加二", "value": 30},
    {"name": "加三", "value": 80},
  ]
  let data = new Object();
  data.chartData = chartData;
  data.chartName = '各部门完成情况';
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
// 部门完成--饼
function setQuantityPie(chart) {
  let chartData = [
    {"name": "完成", "value": 100},
    {"name": "剩余", "value": 30}
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
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50}
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
