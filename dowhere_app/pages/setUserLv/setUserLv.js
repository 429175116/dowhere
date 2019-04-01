// pages/setUserLv/setUserLv.js
// 输入用户（客户）产品列表
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },
  onLoad(options) {
    this.setData({
      listData: this.getListData()
    })
    
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
    let data = [
      {"name": "产品1产品1", "id": "1"},
      {"name": "产品1", "id": "1"},
      {"name": "产品1", "id": "1"},
      {"name": "产品1", "id": "1"},
      {"name": "产品1产品1产品1", "id": "1"},
      {"name": "产品1", "id": "1"},
      {"name": "产品1", "id": "1"},
      {"name": "产品1", "id": "1"}
    ]
    return data
    wx.request({
      url: `${app.globalData.requestUrl}/api/goods`,
      method: 'POST',
      data: {
        role_id: app.globalData.userInfo.role_id,
        uid: app.globalData.userInfo.id
      },
      success: data => {
        if (data.data.code == 1) {
          data = data.data.data
          data = [
            {"name": "产品1产品1", "id": "1"},
            {"name": "产品1", "id": "1"},
            {"name": "产品1", "id": "1"},
            {"name": "产品1", "id": "1"},
            {"name": "产品1产品1产品1", "id": "1"},
            {"name": "产品1", "id": "1"},
            {"name": "产品1", "id": "1"},
            {"name": "产品1", "id": "1"}
          ]
          return data
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

