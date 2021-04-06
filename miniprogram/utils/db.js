const db = wx.cloud.database({
  env: 'wanggk-dev-env-0gp1yfq606d6aaaa'
})

const util = require("./util")

module.exports = {
  /**
   * get products list
   */
  addOwner(owner, family, family_id, isAddFamily){
    return util.isAuthenticated().then(()=>{
      return wx.cloud.callFunction({
        name: 'addOwner',
        data: {owner,family, family_id, isAddFamily}
      })
    }).catch(err=>{
      console.error("addOwner err:", err)
      wx.showToast({
        icon: 'none',
        title: 'Please Login First'
      })
      return {}
    })
  },

  getOwnerList() {
    return util.isAuthenticated().then(()=>{
      return wx.cloud.callFunction({
        name: 'getOwnerList'
      })
    }).catch(err=>{
      wx.showToast({
        icon: 'none',
        title: 'Please Login First'
      })
      return {}
    })
  },

  getRecordByDay(day, owner, family_id) {
    return util.isAuthenticated().then(()=>{
      return wx.cloud.callFunction({
        name: 'getRopeRecordByDay',
        data: {day, owner, family_id}
      })
    }).catch(err=>{
      wx.showToast({
        icon: 'none',
        title: 'Please Login First'
      })
      return {}
    })
  },

  getRecordByOwner(owner, family_id, desc=true) {
    return util.isAuthenticated().then(()=>{
      return wx.cloud.callFunction({
        name: 'getRopeRecordByOwner',
        data: {owner, family_id, desc}
      })
    }).catch(err=>{
      wx.showToast({
        icon: 'none',
        title: 'Please Login First'
      })
      return {}
    })
  },

  addToRopeRecord(day, count, owner, family_id){
    return util.isAuthenticated().then(()=>{
      return wx.cloud.callFunction({
        name: 'addToRopeRecord',
        data: {day, count, owner, family_id}
      })
    }).catch(err=>{
      wx.showToast({
        icon: 'none',
        title: 'Please Login First'
      })
      return {}
    })
  },

  buildFamilyRel(invt_family_id){
    return util.isAuthenticated().then(()=>{
      return wx.cloud.callFunction({
        name: 'buildFamilyRel',
        data: {invt_family_id}
      })
    }).catch(err=>{
      console.log("buildFamilyRel:  55555")
      console.error("buildFamilyRel err:", err)
      wx.showToast({
        icon: 'none',
        title: 'Please Login First',
        duration: 1000
      })
      return {}
    })
  },


}