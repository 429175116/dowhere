// pages/oneLvSon1/oneLvSon1.js
import * as echarts from '../../ec-canvas/echarts';
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
      url: `/pages/oneLvSon2/oneLvSon2?id=${e.currentTarget.dataset.id}`
    })
  },
  getListData(options) {
    wx.request({
      url: `${app.globalData.requestUrl}/api/parts_list`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        goods_id: options.id,
        type: 1,
        month: options.month
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

