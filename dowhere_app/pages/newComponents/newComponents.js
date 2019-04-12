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
    goodsNameList: [],
    goodsList: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let goodsNameList = []
    let goodsList = app.globalData.goodsList
    let i = 0
    for (i in goodsList) {
      goodsNameList.push(goodsList[i].name)
    }
    this.setData({
      goodsList: goodsList,
      goodsNameList: goodsNameList,
      prodcutid: options.prodcutid,
      userInfo: app.globalData.userInfo
    })
  },
  //普通选择器：
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
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
    let name = event.detail.value.name
    let year_plan_num = event.detail.value.year_plan_num
    let year_plan_bout = event.detail.value.year_plan_bout
    let year_fulfil_bout = event.detail.value.year_fulfil_bout
    let newImage = this.data.image
    let feature = event.detail.value.feature
    // console.log(name)
    // console.log(newImage)
    if (name == '') {
      wepy.showModal({
        title: '',
        content: '请输入零件名称',
        showCancel: false
      })
      return
    }
    if (year_plan_num == '') {
      year_plan_num = 0
    }
    if (year_plan_bout == '') {
      year_plan_bout = 0
    }
    if (year_fulfil_bout == '') {
      year_fulfil_bout = 0
    }
    if (newImage == '') {
      wepy.showModal({
        title: '',
        content: '请选择图片',
        showCancel: false
      })
      return
    }
    // console.log(newImage)
    // console.log(year_plan_num)
    // console.log(year_plan_bout)
    // console.log(year_fulfil_bout)
    // console.log(this.data.userInfo.area_id)
    // console.log(this.data.userInfo.branch_id)
    // console.log(this.data.userInfo.id)
    // console.log(this.data.goodsList[this.data.index].id)
    // console.log(name)
    // console.log(feature)
    // return
    // 发送请求,发布广告
    wx.uploadFile({
      url: `${app.globalData.requestUrl}/api/add_parts`,
      method: 'POST',
      header: {
        "Content-Type": "multipart/form-data"
      },
      filePath: newImage,
      name: 'image',
      formData: {
        year_plan_num: year_plan_num,
        year_plan_bout: year_plan_bout,
        year_fulfil_bout: year_fulfil_bout,
        area_id: this.data.userInfo.area_id,
        branch_id: this.data.userInfo.branch_id,
        uid: this.data.userInfo.id,
        goods_id: this.data.goodsList[this.data.index].id,
        name: name,
        feature: feature
      },
      success: data => {
        if (data.data.code == "1") {
          wx.showModal({
            title: '',
            content: '新增零件成功'
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})