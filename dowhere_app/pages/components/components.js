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
    partsInfo: null,
    grandTotal: null,
    randomNum: '',
    randomNum1: '', // 随机数
    randomNum2: '', // 随机数
    randomNum3: '', // 随机数
    randomNum4: '', // 随机数
    planNumber: 0,
    planBout: 0,
    fulfilBout: 0,
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      // 是否随机数
      sham: options.sham,
      imgUrl: app.globalData.imgUrl,
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
    
    // 获取零件的基本信息
    this.gitPartsInfo(options.componentsid)
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取零件的全年完成情况--饼图
    this.getOptionPlanPie(this.data.componentsId)
    // 显示柱状图
    this.HistogramData(this.data.componentsId)
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
          if (this.data.sham == 1) {
            let randomNum = app.RandomNumBoth(10,100)
            this.setData({
              randomNum: randomNum,
              randomNum1: randomNum,
              randomNum2: randomNum,
              randomNum3: randomNum,
              randomNum4: randomNum
            })
          }
          data.feature = data.feature.replace(/】/g,"\n")
          this.setData({
            partsInfo: data,
            // 获取全年数量数据--初始化
            planNumber: data.year_plan_num,
            // 获取全年计划批次数据--初始化
            planBout: data.year_plan_bout,
            // 获取全年完成批次数据--初始化
            fulfilBout: data.year_fulfil_bout
          })
          // 获取零件的全年完成情况--饼图
          this.getOptionPlanPie(this.data.componentsId)
          // 显示柱状图
          this.HistogramData(this.data.componentsId)
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
  delPlanNumberData() {
    this.setData({
      randomNum1: ''
    })
  },
  delPlanBoutData() {
    this.setData({
      randomNum2: ''
    })
  },
  delFulfilBoutData() {
    this.setData({
      randomNum3: ''
    })
  },
  getPartsData(e) {
    // 请求数据拼装
    let type = e.currentTarget.dataset.type
    var serverUrl = ''
    let setData = {
      "uid": this.data.userInfo.id,
      "parts_id": this.data.componentsId
    }
    switch(type){
      case 'planNumber':
        // 全年计划数量
        setData['year_plan_num'] = this.data.planNumber
        serverUrl = 'plan_number'
        break;
      case 'planBout':
        // 全年计划批次
        setData['year_plan_bout'] = this.data.planBout
        serverUrl = 'plan_bout'
        break;
      case 'fulfilBout':
        // 全年完成批次
        setData['year_fulfil_bout'] = this.data.fulfilBout
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
          let remaining = parseInt(data.year_plan_bout) - parseInt(data.year_fulfil_bout)
          let chartData = [
            { "name": "完成", "value": parseInt(data.year_fulfil_bout) },
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
    
  },
  goPlan(e) {
    // 进入计划页
    wx.navigateTo({
      url: `/pages/setPlan/setPlan?componentsid=${this.data.componentsId}&componentsname=${this.data.componentsName}&prodcutname=${this.data.prodcutname}`
    })
  },
  goSchedule(e) {
    let grandTotal = this.grandTotal
    let grandTotalTime = new Array()
    let i = 0
    for (i in grandTotal) {
      grandTotalTime.push(parseInt(grandTotal[i].createTime))
    }
    // 进入进度录入页
    wx.navigateTo({
      url: `/pages/setSchedule/setSchedule?grandtotaltime=${grandTotalTime}&componentsid=${this.data.componentsId}&componentsname=${this.data.componentsName}&prodcutname=${this.data.prodcutname}`
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
          var dayData = data.data.data2
          this.grandTotal = dayData
          // plan 计划
          // remaining 剩余
          // complete 完成
          var chartData = {
            "plan": data.data.data1,
            "remaining": 0,
            "complete": 0,
            "day": []
          }
          var i = 0
          for (i in dayData) {
            chartData.complete += dayData[i].num
            chartData['day'].push({ "name": `${dayData[i].day}号${dayData[i].note}`, "schedule": dayData[i].num })
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
    let k = 100
    if (chartData.day.length < 10) {
      k = 150
    } else if (chartData.day.length < 5) {
      k = 200
    }
    this.setData({
      monthPlanBarHeight: k * chartData.day.length + 500
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
