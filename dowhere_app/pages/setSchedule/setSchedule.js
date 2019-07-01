// pages/setSchedule/setSchedule.js
import check from '../../utils/check'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planData: '',
    note: '',
    dates: '',
    userInfo: '',
    componentsId: '',
    componentsName: '',
    productName: '',
    grandTotalTime: '',
    dayFulfil: [],
    objectIndex: -1,
    month: 0,
    note: ''
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
      month: options.month,
      componentsId: options.componentsid,
      componentsName: options.componentsname,
      productName: options.prodcutname,
      grandTotalTime: options.grandtotaltime
    })
    let dayFulfil = app.globalData.dayFulfil
    let i = 0
    for (i in dayFulfil) {
      dayFulfil[i]["name"] = `${dayFulfil[i].day}号-${dayFulfil[i].num}-${dayFulfil[i].note}`
    }
    this.setData({
      dayFulfil: dayFulfil
    })
  },
  setPlanData(e) {
    // 获取计划
    this.setData({
      planData: e.detail.value
    })
  },
  bindPickerChangeDay(e) {
    this.setData({
      objectIndex: e.detail.value
    })
  },
  bindPickerChange(e) {
    // 获取时间
    let time = e.detail.value.split("-").pop()
    let thisTimeDate = new Date();
    let year = thisTimeDate.getFullYear()
    time = `${year}-${this.data.month}-${time}`
    this.setData({
      dates: time
    })
  },
  setNote(e) {
    // 获取备注
    this.setData({
      note: e.detail.value
    })
  },
  submit(){
    let planData = this.data.planData
    planData = parseInt(planData)
    this.setData({
      planData: planData
    })
    if (this.data.planData == '') {
    // if (this.check._isInt(this.data.planData)) {
      wx.showModal({
        title: '',
        content: '请输入计划'
      })
      return ''
    }
    if (this.data.dates == '') {
      wx.showModal({
        title: '',
        content: '请选择时间'
      })
      return ''
    }
    let thisTimeDate = new Date();
    let year = thisTimeDate.getFullYear()
    var data = {
      uid: this.data.userInfo.id,
      month: this.data.month,
      num: parseInt(this.data.planData),
      parts_id: parseInt(this.data.componentsId),
      year: year,
      note: this.data.note,
    }
    if (this.data.objectIndex != -1) {
      data["id"] = this.data.dayFulfil[this.data.objectIndex].id
    }
    wx.request({
      url: `${app.globalData.requestUrl}/api/month_fulfil`,
      method: 'POST',
      data: data,
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