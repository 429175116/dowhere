// pages/setUserLv/setUserLv.js
// 输入用户（客户）产品列表
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    userInfo: null,
    branchInfo: null,
    img: '',
    annotationInfo: '',
    imgUrl: ''
  },
  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      userInfo: app.globalData.userInfo
    })
    // 获取本地存储的批注信息
    this.getAnnotation()
    // this.getListData()
  },
  onShow() {
    this.getListData()
  },
  returnLogoRun() {
    // 返回登录
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  goProdcutInfo(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/setUserProductInfo/setUserProductInfo?prodcutid=${id}&prodcutname=${name}`
    })
  },
  // 增加添加产品
  newProduct() {
    // 增加产品
    wx.navigateTo({
      url: `/pages/newProduct/newProduct?prodcutid=${this.data.branchInfo.id}`
    })
  },
  // 增加添加零件
  newComponents() {
    // 增加零件
    wx.navigateTo({
      url: `/pages/newComponents/newComponents?prodcutid=${this.data.branchInfo.id}`
    })
  },
  // 加载列表，数据展示
  getListData() {
    // 获取该用户权限下的设备列表
    wx.request({
      url: `${app.globalData.requestUrl}/api/index`,
      method: 'POST',
      data: {
        branch_id: app.globalData.userInfo.branch_id,
        uid: app.globalData.userInfo.id
      },
      success: data => {
        if (data.data.code == 1) {
          data = data.data.data
          wx.setNavigationBarTitle({
            title: data.branch.name
          })
          this.setData({
            branchInfo: data.branch,
            listData: data.goods
          })
          app.globalData.goodsList = this.data.listData
        } else {
          wx.showModal({
            title: '',
            content: data.data.msg
          })
        }
      }
    })
  },
  sortData(data) {
    // 根据name值的长度排序
    data.sort(function(a,b){
      return a['goods_name'].length < b['goods_name'].length;
    })
    return data
  },
  // 获取缓存在本地的批注信息
  getAnnotation() {
    wx.getStorage({
      key: 'annotation',
      success: res => {
        console.log(res)
        if (res.data) {
          // let annotationInfo = res.data
          this.setData({
            annotationInfo: res.data
          })
        }
      }
    })
  },
  setAnnotation(annotationList) {
    wx.setStorageSync('annotation', annotationList)
    wx.showToast({
      title: "保存成功！",
      icon: 'success',
      duration: 800,
      mask:true
    });
    this.getAnnotation()
  },
  setInputAnnotation(e) {
    // 获取输入的批注的信息
    this.setData({
      annotationInfo: e.detail.value
    })
  },
  upDataAnnotation() {
    this.setAnnotation(this.data.annotationInfo)
  },
})
