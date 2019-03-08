// pages/departmentList/departmentList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      {"name": "名字1", "id": "1"},
      {"name": "名字2", "id": "2"},
      {"name": "名字3", "id": "3"},
      {"name": "名字4", "id": "4"},
      {"name": "名字5", "id": "5"},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 查看产品
  goDepartment(e) {
    wx.navigateTo({
      url: `/pages/department/department?projectid=${e.currentTarget.dataset.id}`
    })
  },
})