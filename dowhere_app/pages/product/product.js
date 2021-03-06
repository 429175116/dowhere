// pages/product/product.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    listData: [],
    planBarHeight: 0,
    time: '0',
    projectListData: [],
    annotationInfo: '',
    optionsData: {},
    year: 0,
    month: 0,
    imgUrl: '',
    titleImg: '',
    jump: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      userInfo: app.globalData.userInfo
    })
    if (Object.keys(options).length > 0) {
      this.setData({
        time: options.time,
        branch_id: options.id,
        jump: '1'
      })
    }
    this.getDataTwoData()
  },
  getDataTwoData() {
    let thisTimeDate = new Date();
    let month = thisTimeDate.getMonth() + 1
    let year = thisTimeDate.getFullYear()
    this.setData({
      month: month,
      year: year
    })
    wx.request({
      url: `${app.globalData.requestUrl}/api/two_various`,
      method: 'POST',
      data: {
        // time: 0-月份，1-年
        time: parseInt(this.data.time),
        month: month,
        year: year,
        branch_id: this.data.branch_id,
        uid: this.data.userInfo.id,
        area_id: this.data.userInfo.area_id,
        jump: this.data.jump
      },
      success: data => {
        if (data.data.code == '1') {
          let projectListData = data.data.data
          this.setData({
            projectListData: projectListData
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
    wx.request({
      url: `${app.globalData.requestUrl}/api/two_circle`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        time: parseInt(this.data.time),
        month: month,
        year: year,
        branch_id: this.data.userInfo.branch_id,
        uid: this.data.userInfo.id,
        area_id: this.data.userInfo.area_id,
        jump: this.data.jump
      },
      success: data => {
        if (data.data.code == '1') {
          // data = data.data.data
          // titleImg
          console.log(data.data.data.area.img)
          this.setData({
            titleImg: data.data.data.area.img
          })
        }
      }
    })
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
    for (let i = 0; i < getData.length; i++) {
      chartData.push({ "name": getData[i].name, "value": getData[i].month_fulfil })
    }
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '部门完成情况';
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
    data.chartName = `部门进度`;
    // 计算图表显示高度
    let k = 100
    // if (chartData.length < 10) {
    //   k = 200
    // } else if (chartData.length < 5) {
    //   k = 200
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  returnLogoRun() {
    // 返回登录
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  goProduct(e) {
    if (this.data.userInfo.role_id == '7') {
      wx.showModal({
        title: '',
        content: '三级用户不可查看'
      })
      return ''
    }
    wx.navigateTo({
      url: `/pages/oneLvHome/oneLvHome?id=${e.currentTarget.dataset.id}&time=${this.data.time}&month=${this.data.month}&img=${e.currentTarget.dataset.img}`
    })
  },
  // 数据展示时间切换
  // 切换--年
  yearData() {
    if (this.data.time == "0") {
      this.setData({
        time: "1"
      })
    } else {
      return ''
    }
    // 点击月或者年刷新数据
    this.getDataTwoData()
  },
  // 切换--月
  monthData() {
    if (this.data.time == "1") {
      this.setData({
        time: "0"
      })
    } else {
      return ''
    }
    // 点击月或者年刷新数据
    this.getDataTwoData()
  },
  setInputAnnotation(e) {
    // 获取输入的批注的信息
    this.setData({
      annotationInfo: e.detail.value
    })
  },
  upDataAnnotation() {
    app.setAnnotation(this.data.annotationInfo)
  },
})