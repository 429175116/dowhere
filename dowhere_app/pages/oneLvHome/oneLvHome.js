// pages/oneLvHome/oneLvHome.js
// // pages/projectAll/projectAll.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({
  data: {
    userInfo: null,
    projectListData: [],
    time: '1',
    planBarHeight: 0,
    planBarHeight2: 0,
    annotationInfo: '',
    optionsData: {},
    thisTimeDate: 0,
    departmentList: [],
    thisDepartmentId: '',
    imgUrl: '',
    img: ''
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
        img: options.img
      })
      this.two_to_one(options)
    } else {
      this.getDataOneData()
    }
    // 获取批注信息
    this.getAnnotation()
  },
  two_to_one(options) {
    this.setData({
      optionsData: options
    })
    wx .request({
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
        if (data.data.code === '1') {
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
              completeAllPid.push({"name": getData[i].name, "month_plan": getData[i].month_plan, "month_fulfil": getData[i].month_fulfil})
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
              completeAllPid.push({"name": getData[i].name, "month_plan": getData[i].year_plan, "month_fulfil": getData[i].year_fulfil})
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
          // 完成与未完成饼状图
          this.setOptionAllPlanPie(completePid)
          // 完成与未完成柱状图
          this.setOptionAllPlanBar(completeAllPid)
        }
      }
    })
  },
  getDataOneData(){
    let serverUrl = ''
    if (this.data.userInfo.role_id == 3) {
      // 产品权限
      serverUrl = "one"
    } else if (this.data.userInfo.role_id == 4) {
      // 部门权限
      serverUrl = "one_branch"
    }
    let thisTimeDate = new Date();
    thisTimeDate = thisTimeDate.getMonth() + 1
    this.setData({
      thisTimeDate: thisTimeDate
    })
    wx .request({
      url: `${app.globalData.requestUrl}/api/${serverUrl}`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        time: parseInt(this.data.time),
        month: thisTimeDate,
        branch_id: this.data.userInfo.branch_id,
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code === '1') {
          let getData = data.data.data
          // var area = data.area
          // 区域和部门列表
          var projectListData = []
          var completePid = []
          var completeAllPid = []
          var completeAllHis = []
          let departmentList = []
          // 获取部门列表
          for (let i = 0; i < getData.length; i++) {
            departmentList.push({"name": getData[i].name, "id": getData[i].id, "img": getData[i].img, "goods": getData[i].goods})
          }
          this.setData({
            departmentList: departmentList
          })
          // 将第一个部门作为当前的默认展示对象
          let thisProductNode = departmentList[0].goods
          
          // 获取部门下产品列表
          for (let i = 0; i < thisProductNode.length; i++) {
            projectListData.push({"name": thisProductNode[i].name, "id": thisProductNode[i].id})
          }
          this.setData({
            projectListData: projectListData,
            thisDepartmentId: departmentList[0].id,
            img: departmentList[0].img
          })
          
          if (this.data.time == '1') {
            // 月
            // 获取并生成--当月--的图表数据
            for (let i = 0; i < thisProductNode.length; i++) {
              completeAllPid.push({"name": thisProductNode[i].name, "month_plan": thisProductNode[i].month_plan, "month_fulfil": thisProductNode[i].month_fulfil})
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
            // 获取并生成--全年--的图表数据
            for (let i = 0; i < thisProductNode.length; i++) {
              completeAllPid.push({"name": thisProductNode[i].name, "month_plan": thisProductNode[i].year_plan, "month_fulfil": thisProductNode[i].year_fulfil})
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
          // 完成与未完成饼状图
          this.setOptionAllPlanPie(completePid)
          // 完成与未完成柱状图
          this.setOptionAllPlanBar(completeAllPid)
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
      planBarHeight2: 500
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
    let k = 300
    if (chartData.length < 10) {
      k = 300
    } else if (chartData.length < 5) {
      k = 300
    }
    if (chartData.length > 1) {
      this.setData({
        planBarHeight: k * chartData.length + 100
      })
    } else {
      this.setData({
        planBarHeight: 300
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
    let index = e.currentTarget.dataset.index
    console
    var projectListData = []
    var completePid = []
    var completeAllPid = []
    // 将第一个部门作为当前的默认展示对象
    let thisProductNode = this.data.departmentList[index].goods
          
    // 获取部门下产品列表
    for (let i = 0; i < thisProductNode.length; i++) {
      projectListData.push({"name": thisProductNode[i].name, "id": thisProductNode[i].id})
    }
    this.setData({
      projectListData: projectListData,
      thisDepartmentId: this.data.departmentList[index].id,
      img: this.data.departmentList[index].img
    })
    
    if (this.data.time == '1') {
      // 月
      // 获取并生成--当月--的图表数据
      for (let i = 0; i < thisProductNode.length; i++) {
        completeAllPid.push({"name": thisProductNode[i].name, "month_plan": thisProductNode[i].month_plan, "month_fulfil": thisProductNode[i].month_fulfil})
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
      // 获取并生成--全年--的图表数据
      for (let i = 0; i < thisProductNode.length; i++) {
        completeAllPid.push({"name": thisProductNode[i].name, "month_plan": thisProductNode[i].year_plan, "month_fulfil": thisProductNode[i].year_fulfil})
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
    // 完成与未完成饼状图
    this.setOptionAllPlanPie(completePid)
    // 完成与未完成柱状图
    this.setOptionAllPlanBar(completeAllPid)
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
      url: `/pages/oneLvSon1/oneLvSon1?id=${e.currentTarget.dataset.id}&month=${this.data.thisTimeDate}`
    })
  },
  // 点击月或者年刷新数据
  refreshData() {
    if (Object.keys(this.data.optionsData).length > 0) {
      this.two_to_one(this.data.optionsData)
    } else {
      this.getDataOneData()
    }
  },
    // 数据展示时间切换
  // 切换--年
  yearData() {
    if (this.data.time === "1") {
      this.setData({
        time: "2"
      })
    } else {
      return ''
    }
    // 点击月或者年刷新数据
    this.refreshData()
  },
  // 切换--月
  monthData() {
    if (this.data.time === "2") {
      this.setData({
        time: "1"
      })
    } else {
      return ''
    }
    // 点击月或者年刷新数据
    this.refreshData()
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
  }
});

