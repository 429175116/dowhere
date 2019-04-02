// pages/components/components.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    time: '',
    monthList: [],
    monthPlanBarHeight: 0,
    planBarHeight: 0,
    componentsId: '',
    componentsName: '',
    prodcutname: '',
    mark: '',
    annotationInfo: '',
    partsInfo: null,
    planNumber: 0,
    planBout: 0,
    fulfilBout: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      userInfo: app.globalData.userInfo,
      // 零件ID
      componentsId: options.componentsid,
      // 零件名称
      componentsName: options.componentsname,
      // 产品名称
      prodcutname: options.prodcutname,
      // 获取全部零件或部分零件标记{part：部分；all：全部}
      mark: options.getTypt,
      // 获取当前时间，用于月份显示，只显示已经存在的月份
      monthList: getMonthList(),
      time: month + 1
    })
    // 获取本地存储的批注信息
    this.getAnnotation()
    // 获取零件的基本信息
    this.gitPartsInfo(options.componentsid)
  },
  gitPartsInfo(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/parts`,
      method: 'POST',
      data: {
        parts_id: id
      },
      success: data => {
        if (data.data.code === '1') {
          data = data.data.data
          this.setData({
            partsInfo: data,
            // 获取全年数量数据--初始化
            planNumber: data.plan_number,
            // 获取全年计划批次数据--初始化
            planBout: data.plan_bout,
            // 获取全年完成批次数据--初始化
            fulfilBout: data.fulfil_bout
          })
        } else {
          wx.showModal({
            title: '',
            content: data.data.errmsg
          })
        }
      }
    })
  },
  getPlanNumber(e) {
    // 获取全年数量数据
    this.setData({
      planNumber: e.detail.value
    })
  },
  getPlanBout(e) {
    // 获取全年计划批次数据
    this.setData({
      planBout: e.detail.value
    })
  },
  getFulfilBout(e) {
    // 获取全年完成批次数据
    this.setData({
      fulfilBout: e.detail.value
    })
  },
  getPartsData(e) {
    // 请求数据拼装
    let type = e.currentTarget.dataset.type
    var serverUrl = ''
    let setData = {
      "uid": this.data.userInfo.id,
      "type": 1,
      "parts_id": this.data.componentsId
    }
    switch(type){
      case 'planNumber':
        // 全年计划数量
        setData['plan_number'] = this.data.planNumber
        serverUrl = 'plan_number'
        break;
      case 'planBout':
        // 全年计划批次
        setData['plan_bout'] = this.data.planBout
        serverUrl = 'plan_bout'
        break;
      case 'fulfilBout':
        // 全年完成批次
        setData['fulfil_bout'] = this.data.fulfilBout
        setData['type'] = 2
        serverUrl = 'fulfil_bout'
        break;
      default:
        // wx.showModal({
        //   title: '',
        //   content: '用户未分配权限'
        // })
        break;
    }
    // 数据提交（请求数据，请求接口）
    this.setPartsData(setData, serverUrl)
  },
  setPartsData(setData, serverUrl) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/${serverUrl}`,
      method: 'POST',
      data: setData,
      success: data => {
        if (data.data.code === '1') {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
          // 获取零件的基本信息--信息刷新
          this.gitPartsInfo(setData.parts_id)
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
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
          let remaining = data.plan_number - data.year_fulfil
          let chartData = [
            { "name": "完成", "value": data.year_fulfil },
            { "name": "剩余", "value": remaining }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取零件的全年完成情况--饼图
    this.getOptionPlanPie(this.data.componentsId)
    // 显示柱状图
    this.HistogramData(this.data.componentsId)
  },
  goPlan(e) {
    // 进入计划页
    wx.navigateTo({
      url: `/pages/setPlan/setPlan?componentsid=${this.data.componentsId}&componentsname=${this.data.componentsName}&prodcutname=${this.data.prodcutname}`
    })
  },
  goSchedule(e) {
    // 进入进度录入页
    wx.navigateTo({
      url: `/pages/setSchedule/setSchedule?componentsid=${this.data.componentsId}&componentsname=${this.data.componentsName}&prodcutname=${this.data.prodcutname}`
    })
  },
  selMonth(e) {
    // if (this.data.time === e.currentTarget.dataset.month) {
    //   return ''
    // }
    this.setData({
      // 初始化图表容器高度
      monthPlanBarHeight: 'auto',
      time: e.currentTarget.dataset.month
    })
    this.HistogramData(this.data.componentsId)
  },
  HistogramData(id) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/Histogram`,
      method: 'POST',
      data: {
        parts_id: id,
        month: this.data.time
      },
      success: data => {
        if (data.data.code === '1') {
          let day = data.data.data2
          let chartData = [
            { "name": "计划", "schedule": data.data.data1 },
            { "name": "累积", "schedule": 0 }
          ]
          let addUp = 0
          let i = 0
          for (i in day) {
            chartData[1]['schedule'] += day[i].num
            chartData.push({ "name": `${day[i].day}号`, "schedule": day[i].num })
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
  },
  // 计划完成度--饼
  setOptionPlanPie(chartData) {
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '全年完成情况';
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
