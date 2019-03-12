// pages/setUserLv/setUserLv.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    planBarHeight: 0
  },
  onLoad(options) {
    this.setData({
      listData: getListData()
    })
  },
  goProdcutInfo(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/setUserProductInfo/setUserProductInfo?prodcutid=${id}&prodcutname=${name}&getTypt=part`
    })
  }
})
// 加载列表，数据展示
function getListData() {
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
  // wx.request({
  //   url: `${this.$parent.globalData.requestUrl}/api/getData`,
  //   method: 'POST',
  //   data: {
  //     userName: this.userName,
  //     userPaw: this.userPaw
  //   },
  //   success: data => {
  //     if (data.data.success) {
  //       // data = data.data.novels

  //     } else {
  //       wx.showModal({
  //         title: '',
  //         content: data.data.errmsg
  //       })
  //     }
  //   }
  // })
}
