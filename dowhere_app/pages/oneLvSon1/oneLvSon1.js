// pages/oneLvSon1/oneLvSon1.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    var date = new Date();
    let month = date.getMonth()
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getListData(options.prodcutid)
  },
  goComponents(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/oneLvSon2/oneLvSon2`
    })
  },
  getListData(id) {
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
    this.setData({
      listData: data
    })
    return ''
    wx.request({
      url: `${app.globalData.requestUrl}/api/${serverUrl}`,
      method: 'POST',
      data: {
        uid: this.userInfo.id,
        goods_id: id,
        type: 1
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

