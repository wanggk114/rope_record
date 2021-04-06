// pages/his_record/his_record.js
const util = require('../../utils/util')
const db = require('../../utils/db')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    recordList: [],
  },

  onTapLogin(event){
    console.log("his_record.js onTapLogin:", event)
    this.setData({
      userInfo: event.detail.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
      this.getRecords()
    }).catch(err=>{
      console.log('Not Authenticated yet');
      wx.switchTab({
        url:'/pages/me/me'
      })
    })
  },

  getRecords(){
    wx.showLoading({
      title: 'Still Loading...',
    })

    let family_id=wx.getStorageSync('family_id')
    let owner=wx.getStorageSync('owner')
    console.log("getRecords:family_id ", family_id)
    console.log("getRecords:owner ", owner)
    wx.setNavigationBarTitle({
      title: owner+'的记录' 
    })

    db.getRecordByOwner(owner, family_id).then( result => { 
      wx.hideLoading()

      let data = result.result
      console.log("getRecordByOwner:", data)
      if (data){
        data.forEach((record, index, data)=>{
          data[index] = this.get_total(record)
        })
        this.setData({
          recordList: data
        })
      }
    }).catch( err => {
      console.log("getRecordByOwner err:", err)
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: 'Failed',
      })
    })
  },

  get_total: function(record){
    var counts = record.count.split("|")
    var Sum = 0

    counts.forEach((count, index, counts)=>{
      count = parseInt(count)
      counts[index] = count
      Sum = Sum + count
    })
    record['total']=Sum

    return record
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    this.getRecords()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})