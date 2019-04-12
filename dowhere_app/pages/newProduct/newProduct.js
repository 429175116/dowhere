// pages/newProduct/newProduct.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prodcutid: '',
    userInfo: null,
    code: '',
    image: '',
    imgSize: 0,
    title: '',
    adImage: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      prodcutid: options.prodcutid,
      userInfo: app.globalData.userInfo
    })
  },
  previewImage(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  },
  chooseImage() {
    wx.chooseImage({
      // 最多可以选择的图片张数，默认9
      count: 1,
      // original 原图，compressed 压缩图，默认二者都有
      sizeType: ['original', 'compressed'],
      // album 从相册选图，camera 使用相机，默认二者都有
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          imgSize: res.tempFiles[0].size
        })
        // 判断图片大小1024000
        if (this.imgSize > 1024000) {
          wepy.showModal({
            title: '',
            content: '上传图片大小不可大于1兆(1M)',
            showCancel: false
          })
          // return后不会执行添加图片对象部分，form表单请求出可以不做校验
          return
        }
        var tempFilePaths = res.tempFilePaths
        // 获取图片路径
        this.setData({
          image: tempFilePaths[0]
        })
      },
      fail() {},
      complete() {}
    })
  },
  setAdvertising(event) {
    // 产品名称
    
    let newAdvertisingName = event.detail.value.name
    if (newAdvertisingName == '') {
      wepy.showModal({
        title: '',
        content: '请输入产品名称',
        showCancel: false
      })
      return
    }
    wx.request({
      url: `${app.globalData.requestUrl}/api/add_goods`,
      method: 'POST',
      data: {
        area_id: this.data.userInfo.area_id,
        branch_id: this.data.userInfo.branch_id,
        uid: this.data.userInfo.id,
        title: newAdvertisingName
      },
      success: data => {
        console.log(data)
        if (data.data.code == "1") {
          let id = data.data.data
          wx.showModal({
            title: '',
            content: '新增产品成功'
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