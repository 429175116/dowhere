// // pages/projectAll/projectAll.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

// 计划完成度--饼
function setOptionPlanPie(chart) {
  const option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: 55,
        name: '北京55'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };
  chart.setOption(option);
}
// 各区金额占比--饼
function setOptionQuantityPie(chart) {
  const option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: 55,
        name: '北京55'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };
  chart.setOption(option);
}
// 完成数据详情--柱
function setOptionPlanBar(chart) {
  let chartData = [
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50},
  {"name": "产品1", "plan": 100, "schedule": 50, "remainder": -50}
]
// 产品名，计划，进度，剩余
let namelist = []
let planlist = []
let schedulelist = []
let remainderlist = []
let i = 0
for (i in chartData) {
  namelist.push(chartData[i].name)
  planlist.push(chartData[i].plan)
  schedulelist.push(chartData[i].schedule)
  remainderlist.push(chartData[i].remainder)
}
console.log(namelist)
console.log(planlist)
console.log(schedulelist)
console.log(remainderlist)
const option = {
  color: ['#37a2da', '#32c5e9', '#67e0e3'],
  // 控制浮动框的显示
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: ['计划', '完成', '剩余']
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 15,
    top: 40,
    containLabel: true
  },
  xAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: namelist,
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#666'
      }
    }
  ],
  series: [
    {
      name: '计划',
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'inside'
        }
      },
      data: planlist
    },
    {
      name: '完成',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true
        }
      },
      data: schedulelist
    },
    {
      name: '剩余',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true,
          position: 'left'
        }
      },
      data: remainderlist
    }
  ]
};
chart.setOption(option);
}

Page({
  onReady() {
    // 获取组件
    this.quantityPie = this.selectComponent('#quantity-pie');
    this.planPie = this.selectComponent('#plan-pie');
    this.planBar = this.selectComponent('#plan-bar');
    this.init()
  },

  data: {
    ecQuantityPie: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true 
    },
    ecPlanPie: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true 
    },
    ecPlanBar: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true 
    },
    isLoaded: false,
    isDisposed: false,
    userId: null,
    projectListData: [
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
  },
  onShow() {

  },
  // 数据展示时间切换
  // 切换--年
  yearData(){
    // getBarOption(chartData)
  },
  // 切换--月
  monthData(){
    // getBarOption(chartData)
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
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/department/department?`
    })
  },
  // 查看产品
  goProduct(e) {
    console.log(e.currentTarget.dataset.id)
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
  init() {
    this.quantityPie.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionQuantityPie(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

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
      setOptionPlanPie(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
    this.planBar.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOptionPlanBar(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  }
});
