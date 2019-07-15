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
        name: options.name,
        time: options.time,
        img: options.img,
        jump: '1'
      })
    }
    this.getDataOneData()
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
      url: `${app.globalData.requestUrl}/api/user_goods`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code == '1') {
          this.setData({
            departmentList: data.data.data
          })
          data = data.data.data
          let i = 0
          let index = 0
          for (i in data) {
            if (data[i].name == this.data.name) {
              index = i
            }
          }
          this.setData({
            thisDepartmentId: data[index].id
          })
          this.getGoodInfo({'id':data[index].id, 'name':data[index].name})
        }
      }
    })
  },
  getGoodInfo(dataNode) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/goods_histogram`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        jump: this.data.jump,
        time: parseInt(this.data.time),
        month: this.data.month,
        year: this.data.year,
        id: dataNode.id,
        good_name: dataNode.name,
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code == '1') {
          let projectListData = data.data.data
          let completeAllPid = []
          let i = 0
          for (i in projectListData) {
            completeAllPid.push({"id": projectListData[i].goods[0].id, "name": projectListData[i].name, "month_plan": projectListData[i].plan, "month_fulfil": projectListData[i].fulfil })
          }
          this.setData({
            projectListData: completeAllPid
          })
          // 饼状图
          this.setOptionPlanPie(completeAllPid)
          // 饼状图
          this.setOptionAllFulfilPie(completeAllPid)
          // // 柱状图
          this.setOptionAllPlanBar(completeAllPid)
        }
      }
    })
  },
  setOptionPlanPie(getData) {
    let chartData = []
    for (let i = 0; i < getData.length; i++) {
      chartData.push({ "name": getData[i].name, "value": getData[i].month_fulfil })
    }
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '产品完成情况';
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
  setOptionAllFulfilPie(getData) {
    let plan = 0
    let fulfil = 0
    let i = 0
    for (i in getData) {
      plan += getData[i].month_plan
      fulfil += getData[i].month_fulfil
    }
    let remaining = plan - fulfil
    let chartData = [
      { "name": "完成", "value": fulfil },
      { "name": "剩余", "value": remaining }
    ]
    let data = new Object();
    data.chartData = chartData;
    data.chartName = '完成情况';
    // 图表渲染
    this.planPie = this.selectComponent('#quantity-pie2');
    this.planPie.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      app.pieShow(data, chart)
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
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    if (this.data.thisDepartmentId == id) {
      return ''
    }
    this.setData({
      thisDepartmentId: id
    })
    this.getGoodInfo({'id': id, 'name': name})
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

