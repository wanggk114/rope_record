// pages/me/me.js
const util = require('../../utils/util')
const db = require('../../utils/db')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    familyId: '',
    can_invite:false,
  },

  onTapLogin(event){
    console.log("me.js onTapLogin:", event)
    this.setData({
      userInfo: event.detail.userInfo
    })
    //登陆后判断是否要建立家庭关系
    const invt_family_id=wx.getStorageSync('invited_family_id')
    console.log("onTapLogin:invited_family_id ", invt_family_id)
    if(invt_family_id.length > 0){
      wx.showToast({
        title: '加入邀请家庭',
        duration: 1000
      })
      db.buildFamilyRel(invt_family_id).then(result=>{
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
            title: '您已存在的家庭信息，无需要加入',
            duration: 1500
          })
        } else {
          console.log("buildFamilyRel err, ret_code=", res.result.ret_code)
          wx.showToast({
            title: '加入失败',
            duration: 1500
          })
        }
      }).catch(err=>{
        console.log("buildFamilyRel err: ", err)
        wx.showToast({
          title: '加入失败',
          duration: 1500
        })
      })
    }
  },

  onTapOperate(){
    wx.navigateTo({
      url: '/pages/operate/operate',
    })
  },

  onTapService(){
    wx.showModal({
      title: '联系我们',
      content: 'Mail:wanggk114@163.com',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
  onShow: function (options) {
    const family_id=wx.getStorageSync('family_id')
    const owner=wx.getStorageSync('owner')

    console.log("onShow:family_id ", family_id)
    console.log("onShow:owner ", owner)
    

    if (family_id.length > 0){
      this.setData({
        can_invite: true
      })
    }

    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo,
        familyId: family_id,
      })
    }).catch(err=>{
      console.log('Not Authenticated yet');
    })

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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邀请进入'+this.data.userInfo.nickName+'的跳绳记录',
      path: '/pages/invite/invite?family_id='+this.data.familyId+'&nickName='+this.data.userInfo.nickName,
      imageUrl:'/images/rope.jpg'
    }
  }
})