// pages/setUserProductInfo/setUserProductInfo.js
// 输入用户（客户）零件列表
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    listData: [],
    prodcutInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      prodcutInfo: options,
      userInfo: app.globalData.userInfo
    })
    this.getListData(options.prodcutid)
  },
  goComponents(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/components/components?componentsid=${id}&componentsname=${name}&prodcutname=${this.data.prodcutInfo.prodcutname}`
    })
  },
  // 加载列表，数据展示
  getListData(id) {
    // name--产品名
    // id--产品ID
    // yearPlan--年计划
    // yearSchedule--年进度
    // monthPlan--月计划
    // monthSchedule--月进度
    wx.request({
      url: `${app.globalData.requestUrl}/api/client_parts_list`,
      method: 'POST',
      data: {
        type: 1,
        uid: app.globalData.userInfo.id,
        goods_id: id
      },
      success: data => {
        console.log(data)
        if (data.data.code === '1') {
          this.setData({
            listData: data.data.data
          })
          console.log(this.data.listData)
        } else {
          wx.showModal({
            title: '',
            content: data.data.errmsg
          })
        }
      }
    })
  }
})


