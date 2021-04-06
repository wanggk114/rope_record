// pages/home/home.js
const db = require('../../utils/db')
const util = require('../../utils/util')

const maxCount = 50 //封顶次数

Page({
  data: {
    date: '2021-01-01',
    index: 0,
    ownerList: [], //对象列表
    owner: '', //当前对象
    AddOwner: '', //要增加的对象
    inputValue: '',
    count: 1,
    valueList: [{
      index: 1,
      value: ''
    }], //默认输入框,
    ifAdd: false, //是否要增加记录对象
    ifAddFamily: false, //是否要增加家庭信息
    familyName: '', //当前家庭信息
    familyId: '', //当前家庭ID
    AddFamily: '', //要增加的家庭信息
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.getRopeRecordByDay(true)
  },

  bindOwnerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    const owner = this.data.ownerList[index]
    wx.setStorageSync('owner', owner)
    this.setData({
      owner: owner,
      index: index
    })
    this.getRopeRecordByDay(true)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ToDay = new Date()
    this.setData({
      date: util.formatTime(ToDay)
    })

    util.getUserInfo().then(userInfo => {
      console.log('getUserInfo userInfo', userInfo);
      this.getOwnerList()

    }).catch(err => {
      console.log('Not Authenticated yet', err);
      wx.switchTab({
        url: '/pages/me/me'
      })
    })
  },

  getOwnerList: function () {
    db.getOwnerList().then(result => {
      console.log(result)
      const res = result.result
      let ownerList = []
      let owner = ''
      let ifAddFamily=false

      console.log("getOwnerList:", res)
      ownerList = res.ownerList

      if (ownerList.length > 0) {
        owner = ownerList[0]
      }
      if (res.family_id ===''){
        ifAddFamily = true
      }
      this.setData({
        ownerList: ownerList,
        owner: owner,
        familyName: res.family_name,
        familyId: res.family_id,
        ifAddFamily: ifAddFamily
      })
      wx.setStorageSync('family_id', this.data.familyId)
      wx.setStorageSync('owner', this.data.owner)
      this.getRopeRecordByDay() //获取用户信息后，取当日记录
      if(ifAddFamily === true) //需要增加家庭信息时，大概率是首次使用，显示操作说明
      {
        this.showHelp()
      }
  
    }).catch(err => {
      console.error(err)
    })
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // this.onLoad()
  },

    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindKeyInput: function (e) {
    const dataset = e.currentTarget.dataset
    const index = dataset.id
    const value = e.detail.value
    console.log("index=", index)
    console.log("e.detail.value=", value)

    if (value.trim() !== '')
    {
      this.addOrUpRecord(index, value)
    }
  },

  addEmptyRecord: function () {
    let newList = this.data.valueList
    let Cout = this.data.count

    newList.unshift({
      index: Cout + 1,
      value: ""
    })
    this.setData({
      count: Cout + 1,
      valueList: newList
    })

  },

  addOrUpRecord: function (index, value) {
    let newList = this.data.valueList
    let newCout = this.data.count
    let bFind = false
    let bAddEmpty = false
    newList.forEach(element => {
      if (element.index === index) {
        if (element.value === "") { //原来是空的节点，更新后需要加入新的空节点
          bAddEmpty = true
        }
        element.value = value
        bFind = true
      }
    });

    if (bFind == false) {
      //newList.push({index:index,value:this.data.inputValue})  //后插
      newList.unshift({
        index: index,
        value: this.data.inputValue
      }) //前插
      newCout = newCout + 1
    }

    console.log("newlist=", newList)

    this.setData({
      count: newCout,
      valueList: newList
    })
    if (bAddEmpty === true) {
      this.addEmptyRecord()
    }
  },

  addRecord: function (event) {  //对应组件暂时不用
    const dataset = event.currentTarget.dataset
    const index = dataset.id
    const value = this.data.inputValue
    console.log("index=", index)

    var n = Number(value.trim());
    console.log("n:", n)
    if (!isNaN(n) && n !== 0)
    {
      this.addOrUpRecord(index, value)
    }
  },

  removRecord: function (event) {
    const dataset = event.currentTarget.dataset
    const index = dataset.id
    console.log("index=", index)
    console.log("this.data.count=", this.data.count)

    let newList = this.data.valueList
    let Node = newList.find(element => element.index === index)

    if (Node.value === "") { //空记录不能删除
      wx.showToast({
        title: '空记录不能删除',
      })
    } else {
      let newCout = this.data.count
      newList = newList.filter(element => element.index !== index)
      newList.forEach(element => {
        if (element.index > index) {
          element.index--
        }
      }) //重置index
      newCout = newCout - 1
      console.log("newlist=", newList)

      this.setData({
        count: newCout,
        valueList: newList
      })
    }
  },

  OnTapCommit: function () {
    const dataList = this.data.valueList
    const that=this
    let day = this.data.date
    let owner = this.data.owner
    let family_id = this.data.familyId
    let strCount = ''

    if(dataList.length>maxCount+1){
      wx.showToast({
        title: '不能超过'+maxCount+'次',
      })
      return
    }
    if (family_id === ''){
      wx.showToast({
        title: '需要先增加家庭信息，再提交记录',
      })
      return
    }
    if (owner === ''){
      wx.showToast({
        title: '需要先增加记录对象，再提交记录',
      })
      return
    }
    dataList.forEach(element => {
      if (element.value !== '') {
        strCount = strCount + element.value + '|'
      }
    })
    strCount = strCount.substr(0, strCount.length - 1);
    day = parseInt(day.replace(/-/g, ''));
    console.log("strCount=", strCount)
    console.log("day=", day)
    if (strCount === ''){
      wx.showModal({
        title: '提示',
        content: '提交空记录将清除'+day+'的记录',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.addToRopeRecord(day, strCount, owner, family_id)
          } else if (res.cancel) {
            console.log('用户点击取消')
            return
          }
        }
      })
    }else{
      this.addToRopeRecord(day, strCount, owner, family_id)
    }
  },

  addToRopeRecord:function(day, strCount, owner, family_id){
    util.getUserInfo().then(userInfo => {
      wx.showLoading({
        title: 'Submitting...',
      })
      db.addToRopeRecord(day, strCount, owner, family_id).then(result => {
        wx.hideLoading()
        wx.showToast({
          title: 'Succeed'
        })
      }).catch(err => {
        console.error(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: 'Failed'
        })
      })
    }).catch(err => {
      console.log('Not Authenticated yet');
    })
  },

  OnTapAddOwner: function (e) {
    this.setData({
      ifAdd: true
    })
  },

  OnTapAddFamily: function (e) {
    this.setData({
      ifAdd: true
    })
  },

  cancel: function (e) {
    this.setData({
      ifAdd: false
    })
  },
  confirm: function (e) { //addOwner和addFamily都由此实现
    let addOwner = this.data.AddOwner.trim()
    let addFamily = this.data.AddFamily.trim()
    let isAddFamily = this.data.ifAddFamily
    let family_id = this.data.familyId
    let ownerList = this.data.ownerList
    console.log("confirm, addOwner", addOwner)

    if (isAddFamily && addFamily === '') {
      wx.showToast({
        title: '家庭名称不能为空',
      })
    }else if (!isAddFamily && family_id === '') { 
      wx.showToast({
        title: '请先添加家庭,再添加记录对象',
      })
    }else if (!isAddFamily && addOwner === '') {
      wx.showToast({
        title: '记录对象不能为空',
      })
    } else {
      db.addOwner(addOwner, addFamily, family_id, isAddFamily).then(result => { //家庭信息的增加封装在一起
        let res = result.result
        console.log("confirm res:", res)
        console.log("confirm result:", res.result)
        if (res.result.ret_code === 1) //增加成功
        {
          wx.showToast({
            title: '增加成功',
            duration: 1500
          })
          if (isAddFamily) {
            this.setData({
              AddFamily: addFamily,
              familyName: addFamily,
              ifAdd: false,
              ifAddFamily: false,
            })
          }else{
            ownerList.push(addOwner)
            this.setData({
              AddOwner: addOwner,
              ownerList: ownerList,
              ifAdd: false
            })
            console.log("confirm ownerList:", this.data.ownerList)
          }
          this.onLoad() //重新加载
        } else if (res.result.ret_code === 0) //名称重复
        {
          wx.showToast({
            title: '已存在的信息',
            duration: 1500
          })
        } else {
          console.log("addOwner err, ret_code=", res.result.ret_code)
        }
      }).catch(err => {
        console.error("confirm err:", err)
      })
    }
  },
  setValue: function (e) {
    const isAddFamily = this.data.ifAddFamily
    console.log("setValue, e", e)
    const value = e.detail.value.trim()

    if (isAddFamily) {
      this.setData({
        AddFamily: value
      })
    } else {
      this.setData({
        AddOwner: value
      })
    }
  },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  getRopeRecordByDay: function(changeFlag=false){ //changeFlag==1 表示切换日期或用户
    let day = this.data.date
    const oldvalueList=this.data.valueList

    day = parseInt(day.replace(/-/g, ''));
    const familyId = this.data.familyId
    const owner = this.data.owner

    console.log(day, owner, familyId)

    if (oldvalueList.length>1 && changeFlag===false) { //20210224-已经有输入，则不重新获取
      return
    }

    if (familyId === '' || owner === ''){
      return
    }
    db.getRecordByDay(day, owner, familyId).then(result => {
      const recordList = result.result
      console.log("getRecordByDay 111:", recordList)

      if (recordList.length > 0) {
        const countStr = recordList[0].count
        const countList = countStr.split('|')
        console.log("getRecordByDay 222:", countList)
        let newList = []
        countList.forEach((item, index) => {
          newList.unshift({   //前插
            index: index+1,   //从1开始
            value: Number(item)
          })
        })

        let newCout = countList.length
        newList.unshift({   //空记录
          index: newCout+1,
          value: ''
        })
        console.log("getRecordByDay newList:", newList)

        this.setData({
          valueList: newList,
          count: newList.length
        })
      }else{  //查回是空
        this.setData({
          count: 1,
          valueList: [{
            index: 1,
            value: ''
          }], //默认输入框,
        })
      }
    })
  },

  showHelp:function(){
    wx.navigateTo({
      url: '/pages/operate/operate',
    })
  },

})