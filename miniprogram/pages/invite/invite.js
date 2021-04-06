// miniprogram/pages/invite.js
const util = require('../../utils/util')
const db = require('../../utils/db')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviterName:'',
    familyId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("invite onLoad:", options)
    if (options.family_id){ //参数有定义
      this.setData({
        familyId: options.family_id,
        inviterName: options.nickName,
      })
    }else{  
      console.log("invite onLoad 不是跳转来的 familyId用测试值")
      this.setData({  //置默认值，测试用
        familyId: "123456789",
        inviterName: "AK",
      })
    }
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
  
  cancel: function(){ //取消，则到首页
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  confirm: function(){
    util.getUserInfo()
    .then(userInfo => {  //已登陆，可建立关系
      console.log('getUserInfo userInfo', userInfo);
      //登陆后判断是否要建立家庭关系
      const invt_family_id = this.data.familyId
      console.log("buildFamilyRel:invited_family_id ", invt_family_id)
      if(invt_family_id.length > 0){
        db.buildFamilyRel(invt_family_id)
        .then(result=>{
          let res = result.result
          console.log("buildFamilyRel res:", res)
          if (res.result.ret_code === 1) //增加成功
          {
            wx.showToast({
              title: '加入成功',
              duration: 1500
            })
          } else if (res.result.ret_code === 0) //已有关系
          {
            wx.showToast({
              title: '您已存在家庭，无需要加入',
              duration: 1500
            })
          } else {
            console.log("buildFamilyRel err, ret_code=", res.result.ret_code)
            wx.showToast({
              title: '加入失败',
              duration: 1500
            })
          }
        })
        .catch(err=>{
          console.log("buildFamilyRel: 3333 ")
          console.log("buildFamilyRel err: ")
          wx.showToast({
            title: '加入失败',
            duration: 1500
          })
        })
        wx.switchTab({
          url: '/pages/home/home'  
        })
      }
    })
    .catch(err => {  //未登陆，需要登陆后再建立关系
      console.log('Not Authenticated yet');
      wx.setStorageSync('invited_family_id', this.data.familyId) //防止没登陆跳转后得丢失family_id
      wx.showToast({
        title: '需要先登陆',
      })
      wx.switchTab({
        url: '/pages/me/me'  
      })
    })
  },

})