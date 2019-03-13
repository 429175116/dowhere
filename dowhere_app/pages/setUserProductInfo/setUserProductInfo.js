// pages/setUserProductInfo/setUserProductInfo.js
// 输入用户（客户）零件列表
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      // // 产品ID
      // productId: options.prodcutid,
      // // 产品ID
      // productName: options.prodcutname,
      listData: this.getListData(options.prodcutid)
    })
  },
  goComponents(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/components/components?prodcutid=${id}&prodcutname=${name}&getTypt=all`
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
    let data = [
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 },
      { "name": "零件1", "id": "1", "yearPlan": 150, "yearSchedule": 50, "monthPlan": 150, "monthSchedule": 50 }
    ]
    return data
    wx.request({
      url: `${app.globalData.requestUrl}/api/parts_list`,
      method: 'POST',
      data: {
        sid: id,
        uid: app.globalData.userInfo.id
      },
      success: data => {
        if (data.data.success) {
          

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


