// pages/login/login.js
import check from '../../utils/check'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userPaw: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 创建校验用的示例对象
    this.check = new check()
  },
  // 忘记密码
  alterPassword() {
    wx.navigateTo({
      url: `/pages/alterPassword/alterPassword?`
    })
  },
  // 注册
  registerd() {
    wx.navigateTo({
      // url: `/pages/commodity/commodity?id=${id}`
      url: `/pages/registered/registered?`
    })
  },
  getUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  getUserPaw(e) {
    this.setData({
      userPaw: e.detail.value
    })
  },
  submit() {
    if (this.check.isPhone(this.data.userName)) {
      wx.showModal({
        title: '',
        content: '请输入正确的账号'
      })
      return ''
    }
    if (this.check.isNull(this.data.userPaw)) {
      wx.showModal({
        title: '',
        content: '请输入密码'
      })
      return ''
    }
    // 全局变量 存储用户信息
    getApp().globalData.userId = 10;
    wx.redirectTo({
      url: `/pages/projectAll/projectAll?`
    })
    return ''
    wx.request({
      url: `${this.$parent.globalData.requestUrl}/api/logo`,
      method: 'POST',
      data: {
        userName: this.data.userName,
        userPaw: this.data.userPaw
      },
      success: data => {
        if (data.data.success) {
          // data = data.data.novels
          // this.searchBook = data.data
          // 根据不同的用户权限进入不同的页面
          wx.redirectTo({
            // url: `/pages/commodity/commodity?id=${id}`
            url: `/pages/registered/registered?`
          })
          // 全局变量 存储用户信息
          getApp().globalData.userId = 10;
          this.$apply()
        } else {
          wx.showModal({
            title: '',
            content: data.data.errmsg
          })
        }
      }
    })
    // 
  }

})