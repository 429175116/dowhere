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
    requestUrl: 'https://dowhere.beaconway.cn', //线下
    // requestUrl: 'http://192.168.1.177', //线下
    imgUrl: 'https://dowhere.beaconway.cn',
    // imgUrl: 'http://192.168.1.177'
  },
  // 生成固定范围内的随机数
  RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
  },
  pieShow(data, chart) {
    let chartName = data.chartName
    data = data.chartData
    const option = {
      title: {
        text: chartName,
        // subtext: '',
        x: "center",
        textStyle: {
          fontSize: 20
        },
      },
      // 显示的提示信息
      tooltip: {
        trigger: 'item',
        formatter: "    {b}    \n    {c} ({d}%)    ",
        backgroundColor: 'rgba(255,0,0,0.7)',
        textStyle: {
          fontSize: 40,
          color: '#fff'  // 设置文本颜色 默认#FFF
        }
      },
      backgroundColor: "#ffffff",
      color: ["#78ac47", "#37A2DA", "#f46240", "#facb1e", "#99df20", "#2d7de7", "#FFDB5C", "#FF9F7F"],
      series: [{
        label: {
          normal: {
            fontSize: 14,
            formatter: '{b}'
            // textStyle: {
            //   fontSize: 30
            // }
          }
        },
        type: 'pie',
        center: ['50%', '55%'],
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
    namelist.unshift('')
    planlist.unshift(0)
    schedulelist.unshift(0)
    remainderlist.unshift(0)
    // let chartSubtext = data.chartSubtext
    const option = {
      title: {
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
        // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //   type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        // },
        backgroundColor: 'rgba(255,0,0,0.7)',
        textStyle: {
          fontSize: 40,
          color: '#fff'  // 设置文本颜色 默认#FFF
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
            fontSize: 14,
            interval: 0,
            rotate: 20,
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
          barGap: '0',//柱图间距
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
          barGap: '0',//柱图间距
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
          barGap: '0',//柱图间距
          label: {
            normal: {
              // position: 'inside'
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
    namelist.unshift('')
    planlist.unshift(0)
    schedulelist.unshift(0)
    remainderlist.unshift(0)
    let chartName = data.chartName
    // let chartSubtext = data.chartSubtext
    const option = {
      title: {
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
        },
        backgroundColor: 'rgba(255,0,0,0.7)',
        textStyle: {
          fontSize: 40,
          color: '#fff'  // 设置文本颜色 默认#FFF
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
            fontSize: 14,
            interval: 0,
            rotate: 20,
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
    // console.clear()
    // console.log(data.namePlanlist + "============================================")
    // 产品名，计划，进度，剩余
    let name = ['计划', '剩余', '总完成']
    let namelist = ['']
    let namePlanlist = data.namePlanlist
    for (let i in namePlanlist) {
      namelist.push(namePlanlist[i])
    }
    for (let i in name) {
      namelist.push(name[i])
    }
    for (let i in data.namelist) {
      namelist.push(data.namelist[i])
    }
    // concat()数组合并
    // unshift()输首位添加
    let schedulelist = [0]
    let schedulePlanlist = data.schedulePlanlist
    let chartsData = [data.plan, data.remaining, data.complete]
    for (let i in schedulePlanlist) {
      schedulelist.push(schedulePlanlist[i])
    }
    for (let i in chartsData) {
      schedulelist.push(chartsData[i])
    }
    for (let i in data.schedulelist) {
      schedulelist.push(data.schedulelist[i])
    }
    // data.schedulelist
    // schedulelist = chartsData.concat(schedulelist)
    // schedulelist = schedulelist.concat(schedulelist)
    // schedulelist.unshift(0)
    let chartName = data.chartName
    const option = {
      title: {
        text: chartName,
        x: "center",
        textStyle: {
          fontSize: 20
        },
      },
      color: ['#ED8C24'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
        },
        backgroundColor: 'rgba(255,0,0,0.7)',
        textStyle: {
          fontSize: 40,
          color: '#fff'  // 设置文本颜色 默认#FFF
        },
        formatter: function (namelist, ticket, callback) {
          var showHtm = "";
          for (var i = 0; i < namelist.length; i++) {
            //x轴名称
            var name = namelist[i].axisValue;
            //值
            var value = namelist[i].value;
            showHtm += '     ' + name + '     \n     ' + value + '     '
          }
          return showHtm;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          axisLabel: {
            interval: 0,
            rotate: 20,
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: namelist,
          // data : ['Mon', 'Tue', 'Wed', 'Thu'],
          axisLabel: {
            interval: 0
          },
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '60%',
          data: schedulelist
        }
      ]
    };
    chart.setOption(option);
  },
  setAnnotation(annotationInfo) {
    wx.request({
      url: `${this.globalData.requestUrl}/api/annotation`,
      method: 'POST',
      data: {
        annotation: annotationInfo,
        id: this.globalData.userInfo.id
      },
      success: data => {
        if (data.data.code === '1') {
          wx.showToast({
            title: "批注添加成功！",
            icon: 'success',
            duration: 1000,
            mask: true
          });
        }
      }
    })
  },
})
