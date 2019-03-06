// pages/alterPassword/alterPassword.js
import check from '../../utils/check'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userPaw: '',
    userPaw2: '',
    verificationCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 创建校验用的示例对象
    this.check = new check()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getVerificationCode() {
    if (this.check.isPhone(this.data.userName)) {
      wx.showModal({
        title: '',
        content: '请输入正确的手机号'
      })
      return ''
    }
    // 获取验证码
    console.log('获取验证码')
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
  getUserPaw2(e) {
    this.setData({
      userPaw2: e.detail.value
    })
  },
  setVerificationCode(e) {
    this.setData({
      verificationCode: e.detail.value
    })
  },
  submit() {
    // console.log('提交')
    if (this.check.isNull(this.data.userName) || this.check.isNull(this.data.userPaw) || this.check.isNull(this.data.userPaw2) || this.check.isNull(this.data.verificationCode)) {
      wx.showModal({
        title: '',
        content: '请输入注册信息'
      })
      return ''
    }
    if (this.data.userPaw !== this.data.userPaw2) {
      wx.showModal({
        title: '',
        content: '两次输入的密码不同'
      })
      return ''
    }
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
    // 
  }
})