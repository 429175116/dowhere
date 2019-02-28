// // pages/projectAll/projectAll.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({
  data: {
    userId: null,
    projectListData: [],
    time: 'month',
    planBarHeight: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 此处加载项目及区域数据 
    let projectListData = [
      {"name": "一区", "project": [
        {"projectName": "项目1项目1项目1","id": "1"},
        {"projectName": "项目1项目1","id": "2"},
        {"projectName": "项目1项目1项目1项目1","id": "3"},
        {"projectName": "项目4","id": "4"},
        {"projectName": "项目1项目1","id": "5"},
        {"projectName": "项目6","id": "6"},
        {"projectName": "项目1项目1","id": "7"}
      ]},
      {"name": "7区", "project": [
        {"projectName": "项目1","id": "1"},
        {"projectName": "项目2","id": "1"},
        {"projectName": "项目3","id": "1"},
        {"projectName": "项目4","id": "1"},
        {"projectName": "项目5","id": "1"},
        {"projectName": "项目6","id": "1"},
        {"projectName": "项目7","id": "1"}
      ]}
    ]
    this.setData({
      projectListData: projectListData
    })
  },
  onShow() {

  },
  onReady() {
    // 获取组件
    this.quantityPie = this.selectComponent('#quantity-pie');
    this.planPie = this.selectComponent('#plan-pie');
    // this.planBar = this.selectComponent('#plan-bar');
    this.init(this.data.time)
    this.setOptionPlanBar()
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

  // 加载数据图表数据

  // 点击项目事件
  clickProject(e) {
    // 此处判断权限，如果包含产品和部门的权限则显示气泡框
    // 如果只有一个权限则直接跳转只该权限对应的页面
    // 查看部门
    // this.goDepartment(e)
    // 查看产品
    this.goDepartment(e)
    return ''
    const query = wx.createSelectorQuery()
    query.select('#the-id'+ e.currentTarget.dataset.id)
    query.selectViewport().boundingClientRect()
    // query.selectViewport().width()
    query.exec(res => {
      console.log('打印demo的元素的信息', res);
      console.log(e.currentTarget.offsetLeft,res[0].width)
      this.setData({
        // selGoPage_x:res.width,
        selGoPage_x: e.currentTarget.offsetLeft,
        selGoPage_y: e.currentTarget.offsetTop + 30
      })
    })
  },
  // 产看部门
  goDepartment(e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/department/department?`
    })
  },
  // 查看产品
  goProduct(e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/product/product?`
    })
  },
  getProjectList() {
    console.log(this.data.userId)
    return ''
    wx.request({
      url: `${this.$parent.globalData.requestUrl}/api/logo`,
      method: 'POST',
      data: {
        userName: this.userName,
        userPaw: this.userPaw
      },
      success: data => {
        if (data.data.success) {
          // data = data.data.novels
          this.$apply()
        } else {
          wx.showModal({
            title: '',
            content: data.data.errmsg
          })
        }
      }
    })
  },
  // 点击按钮后初始化图表
  init(time) {
    this.quantityPie.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionQuantityPie(chart, time);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    this.planPie.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionPlanPie(chart, time);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    // this.planBar.init((canvas, width, height) => {
    //   // 获取组件的 canvas、width、height 后的回调函数
    //   // 在这里初始化图表
    //   const chart = echarts.init(canvas, null, {
    //     width: width,
    //     height: height
    //   });
    //   setOptionPlanBar(chart, time);
    //   // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    //   return chart;
    // });
  },
  setOptionPlanBar() {
    if (this.data.time == "month") {
      //加载月份数据---此处修改参数
      
    } else {
      // 加载年份数据---此处修改参数
    }
    let chartData = [
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50},
      {"name": "产品1", "plan": 100, "schedule": 50}
    ]
    let namelist = []
    let planlist = []
    let schedulelist = []
    let remainderlist = []
    let i = 0;
    for (i in chartData) {
      namelist.push(chartData[i].name)
      planlist.push(chartData[i].plan)
      schedulelist.push(chartData[i].schedule)
      remainderlist.push(chartData[i].schedule - chartData[i].plan)
    }
    let data = new Object();
    data.namelist = namelist;
    data.planlist = planlist;
    data.schedulelist = schedulelist;
    data.remainderlist = remainderlist;
    // 计算图表显示高度
    this.setData({
      planBarHeight: 100 * chartData.length
    })
    this.planBar = this.selectComponent('#plan-bar');
    this.planBar.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      app.barShow(data, chart)
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
  }
});


// 计划完成度--饼
function setOptionPlanPie(chart, time) {
  if (time == "month") {
    //加载月份数据---此处修改参数
    
  } else {
    // 加载年份数据---此处修改参数
  }
  let data = [
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品3", "value": 80},
  ]
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
// 各区金额占比--饼
function setOptionQuantityPie(chart, time) {
  if (time == "month") {
    //加载月份数据---此处修改参数
    
  } else {
    // 加载年份数据---此处修改参数
  }
  let data = [
    {"name": "产品1", "value": 100},
    {"name": "产品2", "value": 30},
    {"name": "产品3", "value": 80},
  ]
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

// 此处代码已无用，更新为柱状图根据数据长度自动跳转高度--备份 勿删
// // 完成数据详情--柱
// function setOptionPlanBar(chart, time) {
//   if (time == "month") {
//     //加载月份数据---此处修改参数
    
//   } else {
//     // 加载年份数据---此处修改参数
//   }
//   let chartData = [
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50},
//     {"name": "产品1", "plan": 100, "schedule": 50}
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
//   // 图表渲染
//   app.barShow(data, chart)
//   // wx.request({
//   //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
//   //   method: 'POST',
//   //   data: {
//   //     userName: this.userName,
//   //     userPaw: this.userPaw
//   //   },
//   //   success: data => {
//   //     if (data.data.success) {
//   //       // data = data.data.novels
        
//   //     } else {
//   //       wx.showModal({
//   //         title: '',
//   //         content: data.data.errmsg
//   //       })
//   //     }
//   //   }
//   // })
// }
