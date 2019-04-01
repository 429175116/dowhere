// pages/login/login.js
import check from '../../utils/check'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '18700458354',
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
    // if (this.data.userPaw.length < 6 || this.data.userPaw.length > 15) {
    //   wx.showModal({
    //     title: '',
    //     content: '密码长度为6-15位'
    //   })
    //   return ''
    // }
    // let gourl = ''
    
    // console.log(gourl)
    // wx.redirectTo({
    //   url: gourl
    // })
    // return
    wx.request({
      url: `${app.globalData.requestUrl}/api/login`,
      method: 'POST',
      data: {
        mobile: this.data.userName,
        password: this.data.userPaw
      },
      success: data => {
        console.log(data)
        if (data.data.code == 1) {
          // id 用户ID
          // mobile 登陆账号
          // password 密码
          // power  权限
          // role_id 角色(3-一级，2-二级，1-三级，4-客户）
          // role_nature 角色权限（产品和部门-- 1-产品，2-部门，3-产品，部门，0-不处理）
          // status 用户是否删除被
          // username 用户名
          data = data.data.data
          // 用户ID
          app.globalData.userInfo = data
          // 登陆信息存入本地
          // this.setUserLoginInfo(this.data.userName, this.data.userPaw)
          let gourl = ''
          console.log(data.role_id)
          switch(data.role_id){
            case 1:
              // 最高权限，三级级权限---产品,设备
              gourl = '/pages/projectAll/projectAll'
              break;
            case 2:
              // 二级权限--仅有产品
              gourl = '/pages/product/product'
              break;
            case 3:
              // 一级权限
              gourl = '/pages/oneLvHome/oneLvHome'
              break;
            case 4:
              // 输入用户（客户）权限
              gourl = '/pages/setUserLv/setUserLv'
              break;
            default:
              // wx.showModal({
              //   title: '',
              //   content: '用户未分配权限'
              // })
              // break;
            }
          wx.redirectTo({
            url: gourl
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
          this.submit()
        } else {
          
        }
      }
    })
  },
  setUserLoginInfo(name, password) {
    wx.setStorageSync('userLoginInfo', `${name},------,${password}`)
  }

})