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
    productName: ''
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
  },
  setPlanData(e) {
    // 获取计划
    this.setData({
      planData: parseInt(e.detail.value)
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
        content: '请输入进度'
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
    let time = this.data.dates
    let maonth = time.split('-')[1]
    let createTime = new Date(time.replace(/-/g,"/")).getTime()/1000
    let thisTimeDate = new Date();
    let year = thisTimeDate.getFullYear()
    wx.request({
      url: `${app.globalData.requestUrl}/api/month_plan`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        month: parseInt(maonth),
        num: this.data.planData,
        type: 1,
        parts_id: parseInt(this.data.componentsId),
        createTime: createTime,
        year: year
      },
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