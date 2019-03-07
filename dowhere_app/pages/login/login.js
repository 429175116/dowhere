// pages/login/login.js
import check from '../../utils/check'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '18700458359',
    userPaw: '123',
    passwordInputType: 'password',
    passwordIcon: 'zhengyan'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 创建校验用的示例对象
    this.check = new check()

    this.getUserLoginInfo()
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
    wx.request({
      url: `${app.globalData.requestUrl}/api/login`,
      method: 'POST',
      data: {
        mobile: this.data.userName,
        password: this.data.userPaw
      },
      success: data => {
        if (data.code !== '0') {
          // 登陆信息存入本地
          this.setUserLoginInfo(this.data.userName, this.data.userPaw)
          // 根据不同的用户权限进入不同的页面
          wx.redirectTo({
            url: `/pages/projectAll/projectAll?`
          })
          // 全局变量 存储用户信息
          app.globalData.userId = 10;
          // this.$apply()
        } else {
          wx.showModal({
            title: '',
            content: data.msg
          })
        }
      }
    })
    // 
  },
  getUserLoginInfo() {
    wx.getStorage({
      key: 'userLoginInfo',
      success: res => {
        console.log(res)
        if (res.data) {
          let loginInfo = res.data
          loginInfo = loginInfo.split(',------,')

          this.setData({
            userName: loginInfo[0],
            userPaw: loginInfo[1]
          })
          // console.log(res)
          this.submit()
          // return `${name},------,${password}`
        } else {
          
        }
      }
    })
  },
  setUserLoginInfo(name, password) {
    wx.setStorageSync('userLoginInfo', `${name},------,${password}`)
  }

})