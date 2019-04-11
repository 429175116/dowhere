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
    time: '1',
    projectListData: [],
    annotationInfo: '',
    optionsData: {},
    thisTimeDate: 0,
    imgUrl: ''
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
      })
      this.getDataThree_to_two(options)
    } else {
      this.getDataTwoData()
    }
    // 获取批注内容
    this.getAnnotation()
    
  },
  getDataThree_to_two(options) {
    this.setData({
      optionsData: options
    })
    wx .request({
      url: `${app.globalData.requestUrl}/api/three_to_two`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        time: parseInt(this.data.time),
        month: parseInt(options.month),
        area_id: options.areaid,
        uid: options.uid
      },
      success: data => {
        console.log(data)
        if (data.data.code === '1') {
          let getData = data.data.data
          // var area = data.area
          // 区域和部门列表
          var projectListData = []
          var completePid = []
          var completeAllPid = []
          var completeAllHis = []
          for (let i = 0; i < getData.length; i++) {
            projectListData.push({"name": getData[i].name, "id": getData[i].id, "count": getData[i].count})
          }
          this.setData({
            projectListData: projectListData
          })
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
          this.setOptionAllPlanPie(completeAllPid)
          // 完成与未完成柱状图
          this.setOptionAllPlanBar(completeAllPid)
        }
      }
    })
  },
  getDataTwoData() {
    let getUrl = ''
    if (this.data.userInfo.id == '5') {
      // 产品
      getUrl = 'two'
    } else if (this.data.userInfo.id == '6') {
      // 部门
      getUrl = 'two_branch'
    }
    let thisTimeDate = new Date();
    thisTimeDate = thisTimeDate.getMonth() + 1
    this.setData({
      thisTimeDate: thisTimeDate
    })
    wx.request({
      url: `${app.globalData.requestUrl}/api/${getUrl}`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        time: parseInt(this.data.time),
        month: thisTimeDate,
        branch_id: this.data.userInfo.branch_id,
        uid: this.data.userInfo.id
      },
      success: data => {
        console.log(data)
        if (data.data.code === '1') {
          let getData = data.data.data
          // var area = data.area
          // 区域和部门列表
          var projectListData = []
          var completePid = []
          var completeAllPid = []
          var completeAllHis = []
          for (let i = 0; i < getData.length; i++) {
            projectListData.push({"name": getData[i].name, "id": getData[i].id, "count": getData[i].count})
          }
          this.setData({
            projectListData: projectListData
          })
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
          this.setOptionAllPlanPie(completeAllPid)
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
      remainderlist.push(chartData[i].month_fulfil - chartData[i].month_plan)
    }
    let data = new Object();
    data.namelist = namelist;
    data.planlist = planlist;
    data.schedulelist = schedulelist;
    data.remainderlist = remainderlist;
    data.chartName = `月进度`;
    // 计算图表显示高度
    let k = 100
    if (chartData.length < 10) {
      k = 150
    } else if (chartData.length < 5) {
      k = 200
    }
    this.setData({
      planBarHeight: k * chartData.length + 100
    })
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
  goProduct(e) {
    if (this.data.userInfo == '7') {
      wx.showModal({
        title: '',
        content: '三级用户不可查看'
      })
      return ''
    }
    wx.navigateTo({
      url: `/pages/oneLvHome/oneLvHome?id=${e.currentTarget.dataset.id}&time=${this.data.time}&month=${this.data.thisTimeDate}`
    })
  },
  // 点击月或者年刷新数据
  refreshData() {
    if (Object.keys(this.data.optionsData).length > 0) {
      this.getDataThree_to_two(this.data.optionsData)
    } else {
      this.getDataTwoData()
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
    },
})