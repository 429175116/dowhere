// // pages/projectAll/projectAll.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({
  data: {
    userInfo: null,
    projectListData: [],
    time: 1,
    planBarHeight: 0,
    lv: '',
    annotationInfo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    this.setData({
      lv: options.lv,
      userInfo: app.globalData.userInfo
    })
    console.log(this.data.userId)
    // 此处加载项目及区域数据 
    let projectListData = [
      {"name": "7区", "project": [
        {"projectName": "项目1","id": "1"},
        {"projectName": "项目7","id": "1"}
      ]}
    ]
    this.setData({
      projectListData: projectListData
    })
    // 获取批注内容
    this.getAnnotation()
    this.getDataThree()
  },
  getDataThree(){
  //   {
  //     "code": "1",
  //     "msg": "查询成功",
  //     "date": {
  //         "is_sham": {
  //             "is_sham": 1
  //         },
  //         "area": [
  //             {
  //                 "id": 4,
  //                 "name": "区域4",
  //                 "branch": [
  //                     {
  //                         "branch_id": 5,
  //                         "branch_name": "部门5"
  //                     }
  //                 ],
  //                 "month_plan": 7266, //计划
  //                 "month_fulfil": 246, //完成
  //                 "year_fulfil": 0,
  //                 "year_plan": 0
  //             }
  //         ]
  //     }
  // }
    wx.request({
      url: `${app.globalData.requestUrl}/api/three`,
      method: 'POST',
      data: {
        // time: 1-月份，2-年
        time: 1,
        month: 4,
        uid: this.data.userInfo.id
      },
      success: data => {
        if (data.data.code === '1') {
          data = data.data.data
          var area = data.area
          // 区域和部门列表
          var projectListData = []
          var completePid = []
          var completeAllPid = []
          var completeAllHis = []
          for (let i = 0; i < area.length; i++) {
            projectListData.push({"name": area[i].name, "id": area[i].id, "branch": area[i].branch})
          }
          if (this.data.time == 1) {
            // 月
            for (let i = 0; i < area.length; i++) {
              completeAllPid.push({"name": area[i].name, "month_plan": area[i].month_plan, "month_fulfil": area[i].month_fulfil})
            }
            // console.log(completeAllPid)
            let month_plan = 0
            let month_fulfil = 0
            for (let i = 0; i < completeAllPid.length; i++) {
              month_plan += completeAllPid[i].month_plan // 月计划
              month_fulfil += completeAllPid[i].month_fulfil // 月完成
            }
            completePid['month_plan'] = month_plan // 月计划
            completePid['month_fulfil'] = month_fulfil // 月完成
            // console.log(completePid)
          } else {
            // 年
            for (let i = 0; i < area.length; i++) {
              completeAllPid.push({"name": area[i].name, "month_plan": area[i].year_plan, "month_fulfil": area[i].year_fulfil})
            }
            let month_plan = 0
            let month_fulfil = 0
            for (let i = 0; i < completeAllPid.length; i++) {
              month_plan += completeAllPid[i].year_plan // 月计划
              month_fulfil += completeAllPid[i].year_fulfil // 月完成
            }
            completePid['month_plan'] = month_plan // 月计划
            completePid['month_fulfil'] = month_fulfil // 月完成
          }
          console.log(projectListData)
          console.log(completeAllPid)
          console.log(completePid)
          // return ''
          // 完成与未完成饼状图setOptionAllPlanPie
          this.setOptionPlanPie(completePid)
          // 完成与未完成饼状图
          this.setOptionAllPlanPie(completeAllPid)
        }
      }
    })
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

  onShow() {

  },
  onReady() {
    // // 获取组件
    // this.quantityPie = this.selectComponent('#quantity-pie');
    // this.planPie = this.selectComponent('#plan-pie');
    // // this.planBar = this.selectComponent('#plan-bar');
    // this.init(this.data.time)
    // this.setOptionPlanBar()
    // 显示柱状图
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
          this.grandTotal = day
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
    data.chartName = `月进度`;
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
  // 数据展示时间切换
  // 切换--年
  yearData(){
    if (this.data.time === "month") {
      this.setData({
        time: "year"
      })
    } else {
      return ''
    }
    this.init(this.data.time)
    this.setOptionPlanBar()
  },
  // 切换--月
  monthData(){
    if (this.data.time === "year") {
      this.setData({
        time: "month"
      })
    } else {
      return ''
    }
    this.init(this.data.time)
    this.setOptionPlanBar()
  },
  // 查看产品列表页
  goProduct(e) {
    wx.navigateTo({
      url: `/pages/product/product?area_id=4&time=1&month=4`
    })
  },
  // setOptionPlanBar() {
  //   if (this.data.time == "month") {
  //     //加载月份数据---此处修改参数
  //   } else {
  //     // 加载年份数据---此处修改参数
  //   }
  //   let chartData = [
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     // {"name": "产品1", "plan": 100, "schedule": 50},
  //     {"name": "质量", "plan": 100, "schedule": 50},
  //     {"name": "技术", "plan": 100, "schedule": 50},
  //     {"name": "生产", "plan": 100, "schedule": 50}
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
  //   data.chartName = '各区进度';
  //   // 计算图表显示高度
  //   let k = 100
  //   if (chartData.length < 10) {
  //     k = 150
  //   } else if (chartData.length < 5) {
  //     k = 200
  //   }
  //   this.setData({
  //     planBarHeight: k * chartData.length
  //   })
  //   this.planBar = this.selectComponent('#plan-bar');
  //   this.planBar.init((canvas, width, height) => {
  //     const chart = echarts.init(canvas, null, {
  //       width: width,
  //       height: height
  //     });
  //     app.barShow(data, chart)
  //     // 注意这里一定要返回 chart 实例，否则会影响事件处理等
  //     return chart;
  //   });
  //   // 图表渲染
});