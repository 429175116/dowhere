// pages/oneLvHome/oneLvHome.js
// // pages/projectAll/projectAll.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({
  data: {
    userInfo: null,
    projectListData: [],
    time: '0',
    planBarHeight: 0,
    planBarHeight2: 0,
    annotationInfo: '',
    optionsData: {},
    thisTimeDate: 0,
    departmentList: [],
    thisDepartmentId: '',
    imgUrl: '',
    img: '',
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
        img: options.img,
        jump: '1'
      })
    }
    this.getDataOneData()
  },
  two_to_one(options) {
    this.setData({
      optionsData: options
    })
    wx.request({
      url: `${app.globalData.requestUrl}/api/two_to_one`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        time: parseInt(this.data.time),
        month: parseInt(options.month),
        branch_id: options.id,
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code == '1') {
          let getData = data.data.data
          // var area = data.area
          // 区域和部门列表
          var projectListData = []
          var completePid = []
          var completeAllPid = []
          var completeAllHis = []
          if (this.data.time == '1') {
            // 月
            for (let i = 0; i < getData.length; i++) {
              completeAllPid.push({ "name": getData[i].name, "month_plan": getData[i].month_plan, "month_fulfil": getData[i].month_fulfil })
            }
            let month_plan = 0
            let month_fulfil = 0
            for (let i = 0; i < completeAllPid.length; i++) {
              month_plan += completeAllPid[i].month_plan // 月计划
              month_fulfil += completeAllPid[i].month_fulfil // 月完成
            }
            completePid['month_plan'] = month_plan // 月计划
            completePid['month_fulfil'] = month_fulfil // 月完成
          } else {
            // 年
            for (let i = 0; i < getData.length; i++) {
              completeAllPid.push({ "name": getData[i].name, "month_plan": getData[i].year_plan, "month_fulfil": getData[i].year_fulfil })
            }
            let year_plan = 0
            let year_fulfil = 0
            for (let i = 0; i < completeAllPid.length; i++) {
              year_plan += completeAllPid[i].month_plan // 月计划
              year_fulfil += completeAllPid[i].month_fulfil // 月完成
            }
            completePid['month_plan'] = year_plan // 月计划
            completePid['month_fulfil'] = year_fulfil // 月完成
          }
          // 完成与未完成饼状图
          this.setOptionPlanPie(completePid)
          this.setOptionDepartment(completeAllPid)
          // 完成与未完成饼状图
          this.setOptionAllPlanPie(completePid)
          // 完成与未完成柱状图
          this.setOptionAllPlanBar(completeAllPid)
        }
      }
    })
  },
  getDataOneData() {
    let thisTimeDate = new Date();
    let month = thisTimeDate.getMonth() + 1
    let year = thisTimeDate.getFullYear()
    this.setData({
      month: month,
      year: year
    })
    // 获取部门
    wx.request({
      url: `${app.globalData.requestUrl}/api/user_branch`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code == '1') {
          this.setData({
            departmentList: data.data.data,
            thisDepartmentId: data.data.data[0].id
          })
          // 各产品完成情况
          this.various(data.data.data[0].id)
          // 产品总完成情况柱状图
          this.getFulfil(data.data.data[0].id)
          // 一级用户产品饼状图
          this.getOneCirclel(data.data.data[0].id)
        }
      }
    })
  },
  // 各产品完成情况
  various(branch_id) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/various`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        jump: this.data.jump,
        time: parseInt(this.data.time),
        month: this.data.month,
        year: this.data.year,
        branch_id: branch_id,
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code == '1') {
          let projectListData = data.data.data
          this.setData({
            projectListData: projectListData
          })
          let completeAllPid = []
          let i = 0 
          for (i in projectListData) {
            completeAllPid.push({ "name": projectListData[i].name, "month_plan": projectListData[i].plan, "month_fulfil": projectListData[i].fulfil })
          }
          // 完成与未完成柱状图
          this.setOptionAllPlanBar(completeAllPid)
          this.setOptionDepartment(completeAllPid)
        }
      }
    })
  },
  // 产品总完成情况柱状图
  getFulfil(id) {
    wx.request({
      // url: `${app.globalData.requestUrl}/api/${serverUrl}`,
      url: `${app.globalData.requestUrl}/api/fulfil`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        jump: this.data.jump,
        time: parseInt(this.data.time),
        month: this.data.month,
        year: this.data.year,
        uid: this.data.userInfo.id,
        branch_id: id
      },
      success: data => {
        if (data.data.code == '1') {
          let completePid = {}
          completePid['month_plan'] = data.data.data.plan // 月计划
          completePid['month_fulfil'] = data.data.data.fulfil // 月完成
          this.setOptionPlanPie(completePid)
          // 完成与未完成饼状图
          this.setOptionAllPlanPie(completePid)
        }
      }
    })
  },
  // 一级用户产品饼状图
  getOneCirclel(id) {
    wx.request({
      // url: `${app.globalData.requestUrl}/api/${serverUrl}`,
      url: `${app.globalData.requestUrl}/api/one_circle`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        jump: this.data.jump,
        time: parseInt(this.data.time),
        month: this.data.month,
        year: this.data.year,
        uid: this.data.userInfo.id,
        branch_id: id
      },
      success: data => {
        if (data.data.code == '1') {
          this.setData({
            img: data.data.data.img.img
          })
        }
      }
    })
  },
  // 部门计划完成度--饼
  setOptionDepartment(getData) {
    let chartData = []
    let i = 0
    for (i in getData) {
      chartData.push({ "name": getData[i].name, "value": getData[i].month_fulfil })
    }
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '各产品完成情况';
    // 图表渲染
    this.planPie = this.selectComponent('#department-pie');
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
  setOptionAllPlanPie(chartData) {
    let namelist = []
    let planlist = []
    let schedulelist = []
    let remainderlist = []
    let i = 0;
    namelist.push('总进度')
    planlist.push(chartData.month_plan)
    schedulelist.push(chartData.month_fulfil)
    if (chartData.month_plan > chartData.month_fulfil) {
      remainderlist.push(chartData.month_fulfil - chartData.month_plan)
    } else {
      remainderlist.push(0)
    }

    let data = new Object();
    data.namelist = namelist;
    data.planlist = planlist;
    data.schedulelist = schedulelist;
    data.remainderlist = remainderlist;
    data.chartName = `总进度`;
    this.setData({
      planBarHeight2: 400
    })
    this.monthPlanBar = this.selectComponent('#plan-pie');
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
    data.chartName = `各产品进度`;
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
  onReady() {

  },
  // 选择部门
  selDepartment(e) {
    // let index = e.currentTarget.dataset.index
    let thisDepartmentId = e.currentTarget.dataset.id
    if (this.data.thisDepartmentId == thisDepartmentId) {
      return ''
    }
    this.setData({
      thisDepartmentId: thisDepartmentId
    })
    console.log(thisDepartmentId)
    // 各产品完成情况
    this.various(thisDepartmentId)
    // 产品总完成情况柱状图
    this.getFulfil(thisDepartmentId)
    // 一级用户产品饼状图
    this.getOneCirclel(thisDepartmentId)
  },
  returnLogoRun() {
    // 返回登录
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  // 产品跳转
  goComponentsList(e) {
    wx.navigateTo({
      url: `/pages/oneLvSon1/oneLvSon1?branchid=${this.data.thisDepartmentId}&id=${e.currentTarget.dataset.id}&month=${this.data.thisTimeDate}`
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
    this.getDataOneData()
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
    this.getDataOneData()
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

