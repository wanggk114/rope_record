// miniprogram/pages/operate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operate_text:[
      {summary:'先登陆，添加基本信息，才能开始记录'},
      {summary:'添加基本信息', 
       text:["增加家庭：登记页->'添加家庭信息'按钮; 如果已有家庭信息则无此按钮", 
             "增加记录对象：登记页->选择记录对象后面的'+'号按钮"
            ]
      },
      {summary:'提交记录',
       text:["1天内的次数不能超过50次;",
             "提交空记录，则删除对应日期的记录;"
             ]
      },
      {summary:'邀请家人',
       text:["个人中心->'邀请家人'按钮;",
             "同一家庭的人可以操作、查看此家庭下记录对象的数据;"]
      },
    ]
  },

  onTapConfirm:function(e){
    wx.navigateBack({
      delta: 0,
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

  }
})