// pages/newProduct/newProduct.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    let newImage = this.data.image
    console.log(newAdvertisingName)
    console.log(newImage)
    if (newAdvertisingName == '') {
      wepy.showModal({
        title: '',
        content: '请输入产品名称',
        showCancel: false
      })
      return
    }
    if (newImage == '') {
      wepy.showModal({
        title: '',
        content: '请选择图片',
        showCancel: false
      })
      return
    }
    // 发送请求,发布广告
    wx.uploadFile({
      url: `${app.globalData.requestUrl}/api/add_goods`,
      method: 'POST',
      header: {
        "Content-Type": "multipart/form-data"
      },
      filePath: newImage,
      name: 'image',
      formData: {
        title: newAdvertisingName // 广告名称
      },
      success: data => {
        if (data.statusCode === 201) {
          
          return
        }
        if (data.statusCode === 400) {
          data = data.data
          wepy.showModal({
            title: '',
            content: data.message,
            showCancel: false
          })
        }
      }
    })
  }
})