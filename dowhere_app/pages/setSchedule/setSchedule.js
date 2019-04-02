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
    remarks: '',
    userId: '',
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
      userId: app.globalData.userId,
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
    console.log(this.data.remarks+'====')
  },
  bindPickerChange: function (e) {
    // 获取时间
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  setRemarks(e) {
    // 获取备注
    this.setData({
      remarks: e.detail.value
    })
    console.log(this.data.remarks+'====')
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
    console.log(this.data.planData+'计划')
    console.log(this.data.dates+ '时间')
    console.log(this.data.remarks+'备注')
    console.log(this.data.userId)
    return
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
          // this.searchBook = data.data
          // 根据不同的用户权限进入不同的页面
          this.$redirect(`/pages/registered`)
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