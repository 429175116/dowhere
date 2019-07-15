// // pages/projectAll/projectAll.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({
  data: {
    userInfo: null,
    projectListData: [],
    time: '0',
    planBarHeight: 0,
    month: '',
    annotationInfo: '',
    imgUrl: '',
    jump: '0',
    groupLogo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      userInfo: app.globalData.userInfo
    })
    // 显示默认图表，无数据
    this.setOptionPlanPie({'month_plan': 0, 'month_fulfil': 0})
    this.setOptionAllPlanPie([{'month_plan': 0, 'month_fulfil': 0, 'name': '暂无数据'}])
    this.setOptionAllPlanBar([])
    this.getGroupLogo()
    this.getDataThree()
  },
  getGroupLogo() {
    wx.request({
      url: `${app.globalData.requestUrl}/api/getImg`,
      method: 'POST',
      data: {},
      success: data => {
        if (data.data.code === '1') {
          this.setData({
            groupLogo: data.data.data.img
          })
        }
      }
    })
  },
  getDataThree(){
    let thisTimeDate = new Date();
    let month = thisTimeDate.getMonth() + 1
    let year = thisTimeDate.getFullYear()
    this.setData({
      month: month,
      year: year
    })
    // 
    wx.request({
      url: `${app.globalData.requestUrl}/api/three_various`,
      method: 'POST',
      data: {
        // time: 0-月份，1-年
        time: parseInt(this.data.time),
        month: month,
        year: year,
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code === '1') {
          let projectListData = data.data.data
          this.setData({
            projectListData: projectListData,
            img: data.data.img
          })
          
          let completeAllPid = []
          let completePid = {}
          let month_plan = 0
          let month_fulfil = 0
          let i = 0
          let y = 0
          for (i in projectListData) {
            completeAllPid.push({ "name": projectListData[i].name, "month_plan": projectListData[i].plan, "month_fulfil": projectListData[i].fulfil })
          }
          for (y in projectListData) {
            month_plan += projectListData[y].plan // 月计划
            month_fulfil += projectListData[y].fulfil // 月完成
          }
          completePid['month_plan'] = month_plan // 月计划
          completePid['month_fulfil'] = month_fulfil // 月完成
          // // 完成与未完成饼状图
          this.setOptionPlanPie(completePid)
          // 完成与未完成饼状图
          this.setOptionAllPlanPie(completeAllPid)
          // 完成与未完成柱状图
          this.setOptionAllPlanBar(completeAllPid)
        }
      }
    })
  },


  onShow() {

  },
  onReady() {

  },
  // 计划完成度--饼
  setOptionPlanPie(getData) {
    let remaining = getData.month_plan - getData.month_fulfil
    // let remaining = getData.month_fulfil - getData.month_plan
    let chartData = [
      { "name": "完成", "value": getData.month_fulfil },
      { "name": "剩余", "value": remaining }
    ]
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '完成情况';
    // 图表渲染
    this.planPie = this.selectComponent('#quantity-pie');
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
  setOptionAllPlanPie(getData) {
    let chartData = []
    for (let i = 0;i < getData.length; i++) {
      chartData.push({ "name": getData[i].name, "value": getData[i].month_fulfil })
    }
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '各区完成情况';
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
  setOptionAllPlanBar(chartData) {
    let namelist = []
    let planlist = []
    let schedulelist = []
    let remainderlist = []
    let i = 0;
    for (i in chartData) {
      namelist.push(chartData[i].name)
      planlist.push(chartData[i].month_plan)
      schedulelist.push(chartData[i].month_fulfil)
      if (chartData[i].month_fulfil <= chartData[i].month_plan) {
        remainderlist.push(chartData[i].month_fulfil - chartData[i].month_plan)
      } else {
        remainderlist.push(0)
      }
    }
    let data = new Object();
    data.namelist = namelist;
    data.planlist = planlist;
    data.schedulelist = schedulelist;
    data.remainderlist = remainderlist;
    if (this.data.time == '1') {
      data.chartName = `当月进度`;
    } else {
      data.chartName = `全年进度`;
    }
    
    // 计算图表显示高度
    this.setData({
      planBarHeight: 350
    })
    let k = 100
    // if (chartData.length < 10) {
    //   k = 250
    // } else if (chartData.length < 5) {
    //   k = 250
    // }
    if (chartData.length > 1) {
      this.setData({
        planBarHeight: k * chartData.length + 300
      })
    } else {
      this.setData({
        planBarHeight: 400
      })
    }
    this.monthPlanBar = this.selectComponent('#plan-bar');
    this.monthPlanBar.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      app.barShow(data, chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  // 数据展示时间切换
  setTime(){
    if (this.data.time === "0") {
      this.setData({
        time: "1"
      })
    } else {
      this.setData({
        time: "0"
      })
    }
    this.getDataThree()
  },
  returnLogoRun() {
    // 返回登录
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  // 查看产品列表页
  goProduct(e) {
    wx.navigateTo({
      url: `/pages/product/product?id=${e.currentTarget.dataset.id}&uid=${e.currentTarget.dataset.uid}&time=${this.data.time}&month=${this.data.month}`
    })
  },
  setInputAnnotation(e) {
    // 获取输入的批注的信息
    this.setData({
      annotationInfo: e.detail.value
    })
  },
  upDataAnnotation() {
    app.setAnnotation(this.data.annotationInfo)
  }
});