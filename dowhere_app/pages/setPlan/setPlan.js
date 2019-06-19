// pages/setPlan/setPlan.js
import check from '../../utils/check'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planData: '',
    dates: '',
    userInfo: null,
    componentsId: '',
    componentsName: '',
    productName: '',
    dayPlan: [],
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
    this.setData({
      userInfo: app.globalData.userInfo,
      month: options.month,
      componentsId: options.componentsid,
      componentsName: options.componentsname,
      productName: options.prodcutname
    })
    
    let dayPlan = app.globalData.dayPlan
    let i = 0
    for (i in dayPlan) {
      dayPlan[i]["name"] = `${dayPlan[i].day}号-${dayPlan[i].num}-${dayPlan[i].note}`
    }
    this.setData({
      dayPlan: dayPlan
    })
  },
  setNote(e) {
    // 获取备注
    this.setData({
      note: e.detail.value
    })
  },
  setPlanData(e) {
    // 获取计划
    this.setData({
      planData: parseInt(e.detail.value)
    })
  },
  bindPickerChangeDay(e) {
    console.log(e.detail.value)
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
  submit(){
    if (this.check._isInt(this.data.planData)) {
      wx.showModal({
        title: '',
        content: '请输入进度'
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
    // let createTime = new Date(time.replace(/-/g,"/")).getTime()/1000
    let thisTimeDate = new Date();
    let year = thisTimeDate.getFullYear()
    var data = {
      uid: this.data.userInfo.id,
      month: this.data.month,
      num: parseInt(this.data.planData),
      parts_id: parseInt(this.data.componentsId),
      // createTime: createTime,
      year: year,
      note: this.data.note,
    }
    if (this.data.objectIndex != -1) {
      data["id"] = this.data.dayPlan[this.data.objectIndex].id
    }
    wx.request({
      url: `${app.globalData.requestUrl}/api/month_plan`,
      method: 'POST',
      data: data,
      success: data => {
        if (data.data.code == 1) {
          wx.showModal({
            title: '',
            content: '计划录入成功'
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