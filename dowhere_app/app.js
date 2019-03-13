//app.js

// "pages/login/login", 登陆
// "pages/registered/registered", 注册
// "pages/alterPassword/alterPassword", 重置密码


// "pages/projectAll/projectAll",  最高权限,二级权限首页
// "pages/product/product",  产品列表
// "pages/productInfo/productInfo",  产品详情-零件列表
// "pages/department/department",  部门-产品列表
// "pages/departmentList/departmentList",  部门-产品列表



// "pages/setUserLv/setUserLv"  用户权限--可输入用户--首页--产品列表
// "pages/setUserProductInfo/setUserProductInfo"用户权限--可输入用户--产品详情--零件列表
// "pages/components/components",  零件详情
// "pages/setSchedule/setSchedule",  输入进度
// "pages/setPlan/setPlan",  输入计划

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    requestUrl: 'http://192.168.1.127' //线下
    // requestUrl: 'http://192.168.1.125/' //线上
  },
  pieShow(data, chart) {
    let chartName = data.chartName
    data = data.chartData
    const option = {
      title:{
        text: chartName,
        // subtext: chartSubtext,
        x: "center",
        textStyle: {
          fontSize: 20
        },
      },
      backgroundColor: "#ffffff",
      color: ["#78ac47", "#37A2DA", "#f46240", "#facb1e", "#99df20", "#2d7de7", "#FFDB5C", "#FF9F7F"],
      series: [{
        label: {
          normal: {
            fontSize: 14,
            formatter:'{b}\n({d}%)'
            // textStyle: {
            //   fontSize: 30
            // }
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '70%'],
        //此处写入图表展示的数据
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)'
          }
          // normal:{
          //   label:{
          //     textStyle:{
          //       fontSize: 30
          //     }
          //   }
          // }
        }
      }]
    };
    chart.setOption(option);
  },
  barShow(data, chart) {
    // 产品名，计划，进度，剩余
    let namelist = data.namelist
    let planlist = data.planlist
    let schedulelist = data.schedulelist
    let remainderlist = data.remainderlist
    let chartName = data.chartName
    // let chartSubtext = data.chartSubtext
    const option = {
      title:{
        text: chartName,
        // subtext: "副标题",
        x: "center",
        textStyle: {
          fontSize: 20
        },
      },
      // color: ['#37a2da', '#32c5e9', '#67e0e3'],
      color: ['#ED8C24', '#78AA47', '#F56041'],
      // 控制浮动框的显示
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        top: 40,
        data: ['计划', '完成', '剩余']
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        top: 70,
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
            color: '#666',
            fontSize: 14
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          //此处写入图表展示的数据--名称
          data: namelist,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 14
          }
        }
      ],
      series: [
        {
          name: '计划',
          type: 'bar',
          label: {
            normal: {
              // show: true,
              position: 'inside'
            }
          },
          //此处写入图表展示的数据--计划
          data: planlist
        },
        {
          name: '完成',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              // show: true
            }
          },
          //此处写入图表展示的数据--进度
          data: schedulelist
        },
        {
          name: '剩余',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              // show: true,
              position: 'left'
            }
          },
          //此处写入图表展示的数据--剩余
          data: remainderlist
        }
      ]
    };
    chart.setOption(option);
  },
  setUserBarShow(data, chart) {
    // 产品名，计划，进度，剩余
    let namelist = data.namelist
    let planlist = data.planlist
    let schedulelist = data.schedulelist
    let remainderlist = data.remainderlist
    let chartName = data.chartName
    // let chartSubtext = data.chartSubtext
    const option = {
      title:{
        text: chartName,
        // subtext: "副标题",
        x: "center",
        textStyle: {
          fontSize: 20
        },
      },
      // color: ['#37a2da', '#32c5e9', '#67e0e3'],
      color: ['#ED8C24', '#78AA47', '#F56041'],
      // 控制浮动框的显示
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        top: 40,
        data: ['计划', '完成']
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        top: 70,
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
            color: '#666',
            fontSize: 14
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          //此处写入图表展示的数据--名称
          data: namelist,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 14
          }
        }
      ],
      series: [
        {
          name: '计划',
          type: 'bar',
          label: {
            normal: {
              // show: true,
              position: 'inside'
            }
          },
          //此处写入图表展示的数据--计划
          data: planlist
        },
        {
          name: '完成',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              // show: true
            }
          },
          //此处写入图表展示的数据--进度
          data: schedulelist
        }
      ]
    };
    chart.setOption(option);
  },
  monthBarShow(data, chart) {
    // 产品名，计划，进度，剩余
    let namelist = data.namelist
    // let planlist = data.planlist
    let schedulelist = data.schedulelist
    let chartName = data.chartName
    // let chartSubtext = data.chartSubtext
    const option = {
      title:{
        text: chartName,
        x: "center",
        textStyle: {
          fontSize: 20
        },
      },
      // color: ['#37a2da', '#32c5e9', '#67e0e3'],
      color: ['#ED8C24', '#78AA47', '#F56041'],
      // 控制浮动框的显示
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // legend: {
      //   top: 40,
      //   data: ['计划']
      // },
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        top: 70,
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
            color: '#666',
            fontSize: 14
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          //此处写入图表展示的数据--名称
          data: namelist,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 14
          }
        }
      ],
      series: [
        {
          name: '完成',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              // show: true
            }
          },
          //此处写入图表展示的数据--进度
          data: schedulelist
        }
      ]
    };
    chart.setOption(option);
  }
})
