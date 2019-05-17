// pages/alterPassword/alterPassword.js
import check from '../../utils/check'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userPaw: '',
    userPaw2: '',
    verificationCode: '',
    passwordInputType: 'password',
    passwordIcon: 'zhengyan',
    passwordInputType2: 'password',
    passwordIcon2: 'zhengyan',
    time: 0
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
    clearInterval(this.data.timeShow);
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
    if (this.data.time > 0) {
      return ''
    }
    
    
    // 获取验证码
    // console.log('获取验证码')
    wx.request({
      url: `${app.globalData.requestUrl}/api/sms`,
      method: 'POST',
      data: {
        mobile: this.data.userName
      },
      success: data => {
        if (data.data.code == '1') {
          var that = this
          this.setData({
            time: 60
          })
          this.data.timeShow = setInterval(function() {
            that.data.time -= 1
            that.setData({
              time: that.data.time
            })
            if (that.data.time <= 0) {
              clearInterval(that.data.timeShow);
            }
          }, 1000);
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
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
  delUserName() {
    this.setData({
      userName: ''
    })
  },
  showPassword() {
    if (this.data.passwordInputType == 'password') {
      this.setData({
        passwordInputType: 'text',
        passwordIcon: 'biyan'
      })
    } else {
      this.setData({
        passwordInputType: 'password',
        passwordIcon: 'zhengyan'
      })
    }
  },
  showPassword2() {
    if (this.data.passwordInputType2 == 'password') {
      this.setData({
        passwordInputType2: 'text',
        passwordIcon2: 'biyan'
      })
    } else {
      this.setData({
        passwordInputType2: 'password',
        passwordIcon2: 'zhengyan'
      })
    }
  },
  submit() {
    // console.log('提交')
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
    if (this.data.userPaw.length < 6 || this.data.userPaw.length > 15) {
      wx.showModal({
        title: '',
        content: '密码长度为6-15位'
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
    if (this.check.isNull(this.data.verificationCode)) {
      wx.showModal({
        title: '',
        content: '请输入验证码'
      })
      return ''
    }
    wx.request({
      url: `${app.globalData.requestUrl}/api/new_password`,
      method: 'POST',
      data: {
        mobile: this.data.userName,
        password: this.data.userPaw,
        code: this.data.verificationCode
      },
      success: data => {
        if (data.data.code == '1') {
          wx.showModal({
            title: '',
            content: '修改成功'
          })
          // 返回登录页
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
    // 
  }
})