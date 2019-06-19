// pages/setSchedule/setSchedule.js
import check from '../../utils/check'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planData: '',
    note: '',
    dates: '',
    userInfo: '',
    componentsId: '',
    componentsName: '',
    productName: '',
    grandTotalTime: '',
    dayFulfil: [],
    objectIndex: -1,
    month: 0,
    note: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 创建校验用的示例对象
    this.check = new check()
    app.globalData.userId = 10
    this.setData({
      userInfo: app.globalData.userInfo,
      componentsId: options.componentsid,
      componentsName: options.componentsname,
      productName: options.prodcutname,
      grandTotalTime: options.grandtotaltime
    })
    let dayFulfil = app.globalData.dayFulfil
    let i = 0
    for (i in dayFulfil) {
      dayFulfil[i]["name"] = `${dayFulfil[i].day}号-${dayFulfil[i].num}-${dayFulfil[i].note}`
    }
    this.setData({
      dayFulfil: dayFulfil
    })
    console.log(this.data.dayFulfil)
  },
  setPlanData(e) {
    // 获取计划
    this.setData({
      planData: e.detail.value
    })
  },
  bindPickerChangeDay(e) {
    console.log(e.detail.value)
    this.setData({
      objectIndex: e.detail.value
    })
  },
  bindPickerChange(e) {
    // 获取时间
    let time = e.detail.value.split("-").pop()
    let thisTimeDate = new Date();
    let year = thisTimeDate.getFullYear()
    time = `${year}-${this.data.month}-${time}`
    this.setData({
      dates: time
    })
  },
  setNote(e) {
    // 获取备注
    this.setData({
      note: e.detail.value
    })
  },
  submit(){
    if (this.check._isInt(this.data.planData)) {
      wx.showModal({
        title: '',
        content: '请输入计划'
      })
      return ''
    }
    if (this.data.dates == '') {
      wx.showModal({
        title: '',
        content: '请选择时间'
      })
      return ''
    }
    // let thisTimeDate = new Date();
    // let thisTime = `${thisTimeDate.getFullYear()}/${thisTimeDate.getMonth()+1}/${thisTimeDate.getDate()}`
    // // 获取当天时间的时间戳
    // thisTimeDate = new Date(thisTime).getTime()/1000
    // // 获取输入时间的时间戳
    // let time = this.data.dates
    // let createTime = new Date(time.replace(/-/g,"/")).getTime()/1000
    // 不可输入未来的进度
    // if (thisTimeDate < createTime) {
    //   wx.showModal({
    //     title: '',
    //     content: '不可输入未来的进度'
    //   })
    //   return ''
    // }
    // let grandTotalTime = this.data.grandTotalTime
    // grandTotalTime += `,${thisTimeDate}`
    // if (grandTotalTime.indexOf(createTime) == -1) {
    //   wx.showModal({
    //     title: '',
    //     content: '不可修改不存在的历史数据'
    //   })
    //   return ''
    // }
    // let url = ''
    // // 根据时间不同判断调用不用的接口路径
    // if (thisTimeDate === createTime) {
    //   // 时间为当天是时间
    //   url = 'month_fulfil'
    // } else {
    //   // 时间为历史时间
    //   url = 'update_rate'
    // }
    let thisTimeDate = new Date();
    let year = thisTimeDate.getFullYear()
    var data = {
      uid: this.data.userInfo.id,
      month: this.data.month,
      num: parseInt(this.data.planData),
      parts_id: parseInt(this.data.componentsId),
      // createTime: createTime,
      year: year,
      note: this.data.note,
    }
    if (this.data.objectIndex != -1) {
      data["id"] = this.data.dayPlan[this.data.objectIndex].id
    }
    wx.request({
      url: `${app.globalData.requestUrl}/api/month_fulfil`,
      method: 'POST',
      data: data,
      success: data => {
        if (data.data.code == 1) {
          wx.showModal({
            title: '',
            content: '进度录入成功'
          })
          wx.navigateBack({
            delta: 1
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