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
    productName: ''
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
      productName: options.prodcutname
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
    console.log(e.detail.value)
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
    wx.request({
      url: `${app.globalData.requestUrl}/api/month_fulfil`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        month: this.data.dates,
        num: this.data.planData,
        type: 2,
        parts_id: this.data.componentsId
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