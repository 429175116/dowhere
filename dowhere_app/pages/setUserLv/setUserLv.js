// pages/setUserLv/setUserLv.js
// 输入用户（客户）产品列表
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    userInfo: null
  },
  onLoad(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getListData()
  },
  
  goProdcutInfo(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/setUserProductInfo/setUserProductInfo?prodcutid=${id}&prodcutname=${name}`
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
        console.log(data)
        if (data.data.code == 1) {
          data = data.data.data
          let data1 = this.sortData(data)
          this.setData({
            listData: data1
          })
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
  }
})
