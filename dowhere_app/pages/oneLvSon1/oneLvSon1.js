// pages/oneLvSon1/oneLvSon1.js
// import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    listData: [],
    projectId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      userInfo: app.globalData.userInfo,
      projectId: options.id
    })
    this.getListData(options)
  },
  goComponents(e) {
    wx.navigateTo({
      url: `/pages/components/components?componentsid=${e.currentTarget.dataset.id}`
    })
  },
  getListData(options) {
    let thisTimeDate = new Date();
    let year = thisTimeDate.getFullYear()
    let month = thisTimeDate.getMonth() + 1
    wx.request({
      url: `${app.globalData.requestUrl}/api/client_parts_list`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        branch_id: options.branchid,
        goods_id: options.id,
        type: 1,
        year: year,
        month: month,
        time: 1
      },
      success: data => {
        console.log(data)
        if (data.data.code == 1) {
          this.setData({
            listData: data.data.data
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

