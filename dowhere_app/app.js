//app.js
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
    userId: null
  },
  pieShow(data, chart) {
    const option = {
      backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
      series: [{
        label: {
          normal: {
            fontSize: 14,
            formatter:'{b}\n({d}%)'
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '80%'],
        //此处写入图表展示的数据
        data: data,
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
  },
  barShow(data, chart) {
    // 产品名，计划，进度，剩余
    let namelist = data.namelist
    let planlist = data.planlist
    let schedulelist = data.schedulelist
    let remainderlist = data.remainderlist
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
        left: 10,
        right: 10,
        bottom: 10,
        top: 30,
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
          //此处写入图表展示的数据--名称
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
  }
})
