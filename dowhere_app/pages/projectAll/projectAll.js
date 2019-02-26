// pages/projectAll/projectAll.js
import * as echarts from '../../ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecBar: {
      onInit: function (canvas, width, height) {
        const barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
        barChart.setOption(getBarOption());

        return barChart;
      }
    },

    ecScatter: {
      onInit: function (canvas, width, height) {
        const scatterChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(scatterChart);
        scatterChart.setOption(getScatterOption());

        return scatterChart;
      }
    },

    ecPie: {
      onInit: function (canvas, width, height) {
        const scatterChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(scatterChart);
        scatterChart.setOption(geTPieOption());

        return scatterChart;
      }
    },
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
    ],
    selGoPage_x: 0,
    selGoPage_y: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   userId: options.id
    // })
    this.data.userId = '1'
    this.getProjectList()
    // 获取权限之内的项目
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
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
  }
})
function geTPieOption() {
  return {
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
}
function getBarOption() {
  return {
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
        data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎', '知乎', '知乎', '知乎', '知乎', '知乎', '知乎', '知乎', '知乎'],
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
        data: [300, 270, 340, 344, 300, 320, 310, 310, 310, 310, 310, 310, 310, 310, 310]
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
        data: [120, 102, 141, 174, 190, 250, 220, 220, 220, 220, 220, 220, 220, 220, 220]
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
        data: [-20, -32, -21, -34, -90, -130, -110, -110, -110, -110, -110, -110, -110, -110, -110]
      }
    ]
  };
}

function getScatterOption() {

  var data = [];
  var data2 = [];

  for (var i = 0; i < 10; i++) {
    data.push(
      [
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 40)
      ]
    );
    data2.push(
      [
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100)
      ]
    );
  }

  var axisCommon = {
    axisLabel: {
      textStyle: {
        color: '#C8C8C8'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#fff'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#C8C8C8'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#C8C8C8',
        type: 'solid'
      }
    }
  };

  return {
    color: ["#FF7070", "#60B6E3"],
    backgroundColor: '#eee',
    xAxis: axisCommon,
    yAxis: axisCommon,
    legend: {
      data: ['aaaa', 'bbbb']
    },
    visualMap: {
      show: false,
      max: 100,
      inRange: {
        symbolSize: [20, 70]
      }
    },
    series: [{
      type: 'scatter',
      name: 'aaaa',
      data: data
    },
    {
      name: 'bbbb',
      type: 'scatter',
      data: data2
    }
    ],
    animationDelay: function (idx) {
      return idx * 50;
    },
    animationEasing: 'elasticOut'
  };
}
