// pages/setSchedule/setSchedule.js
import check from '../../utils/check'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planData: '',
    dates: '',
    userInfo: '',
    componentsId: '',
    componentsName: '',
    productName: '',
    grandTotalTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 创建校验用的示例对象
    this.check = new check()
    app.globalData.userId = 10
    this.setData({
      userInfo: app.globalData.userInfo,
      componentsId: options.componentsid,
      componentsName: options.componentsname,
      productName: options.prodcutname,
      grandTotalTime: options.grandtotaltime
    })
  },
  setPlanData(e) {
    // 获取计划
    this.setData({
      planData: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    // 获取时间
    this.setData({
      dates: e.detail.value
    })
  },
  submit(){
    if (this.check.isInt(this.data.planData)) {
      wx.showModal({
        title: '',
        content: '请输入计划'
      })
      return ''
    }
    if (this.check.isDate(this.data.dates)) {
      wx.showModal({
        title: '',
        content: '请选择时间'
      })
      return ''
    }
    let thisTimeDate = new Date();
    let thisTime = `${thisTimeDate.getFullYear()}/${thisTimeDate.getMonth()+1}/${thisTimeDate.getDate()}`
    // 获取当天时间的时间戳
    thisTimeDate = new Date(thisTime).getTime()/1000
    // 获取输入时间的时间戳
    let time = this.data.dates
    let createTime = new Date(time.replace(/-/g,"/")).getTime()/1000
    // 不可输入未来的进度
    if (thisTimeDate < createTime) {
      wx.showModal({
        title: '',
        content: '不可输入未来的进度'
      })
      return ''
    }
    let grandTotalTime = this.data.grandTotalTime
    grandTotalTime += `,${thisTimeDate}`
    if (grandTotalTime.indexOf(createTime) == -1) {
      wx.showModal({
        title: '',
        content: '不可修改不存在的历史数据'
      })
      return ''
    }
    let url = ''
    // 根据时间不同判断调用不用的接口路径
    if (thisTimeDate === createTime) {
      // 时间为当天是时间
      url = 'month_fulfil'
    } else {
      // 时间为历史时间
      url = 'update_rate'
    }
    let maonth = time.split('-')[1]
    wx.request({
      url: `${app.globalData.requestUrl}/api/${url}`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        month: parseInt(maonth),
        num: parseInt(this.data.planData),
        type: 2,
        parts_id: parseInt(this.data.componentsId),
        createTime: createTime
      },
      success: data => {
        if (data.data.code == 1) {
          wx.showModal({
            title: '',
            content: '进度录入成功'
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  }
})