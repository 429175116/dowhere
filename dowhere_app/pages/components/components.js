// pages/components/components.js
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
    annotationInfo: ''
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
      // 获取当前时间，用于月份显示，只显示已经存在的月份
      monthList: getMonthList(),
      time: month + 1

    })
    this.getAnnotation()
  },
  // 获取缓存在本地的批注信息
  getAnnotation() {
    wx.getStorage({
      key: 'annotation',
      success: res => {
        console.log(res)
        if (res.data) {
          // let annotationInfo = res.data
          this.setData({
            annotationInfo: res.data
          })
        }
      }
    })
  },
  setAnnotation(annotationList) {
    wx.setStorageSync('annotation', annotationList)
    this.getAnnotation()
  },
  setInputAnnotation(e) {
    // 获取输入的批注的信息
    this.setData({
      annotationInfo: e.detail.value
    })
  },
  upDataAnnotation() {
    this.setAnnotation(this.data.annotationInfo)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.planPie = this.selectComponent('#plan-pie');
    this.init()
    this.setOptionMonthPlanBar()
  },
  goPlan(e) {
    // 进入计划页
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/setPlan/setPlan?componentsid=${id}&componentsname=${name}&productid=${this.data.productId}&productname=${this.data.productName}`
    })
  },
  goSchedule(e) {
    // 进入进度录入页
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/setSchedule/setSchedule?componentsid=${id}&componentsname=${name}&productid=${this.data.productId}&productname=${this.data.productName}`
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
      this.setOptionPlanPie(chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
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
    let k = 100
    if (chartData.length < 10) {
      k = 150
    } else if (chartData.length < 5) {
      k = 200
    }
    this.setData({
      monthPlanBarHeight: k * chartData.length + 100
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
  },
  // 计划完成度--饼
  setOptionPlanPie(chart) {
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
