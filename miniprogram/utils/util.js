
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  priceFormat(price){
    return parseFloat(Math.round(price * 100) / 100).toFixed(2)
  },

  getUserInfo(){
    return new Promise((resolve, reject) => {
      this.isAuthenticated().then(() => {
        wx.getUserInfo({
          success(res) {
            const userInfo = res.userInfo
            resolve(userInfo)
          }
        })
      }).catch(()=>{
        reject()
      })
    })
  },

  isAuthenticated(){
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          console.log("isAuthenticated res:", res)
          if (res.authSetting['scope.userInfo'] === true) { //还有undefine的情况
            console.log("isAuthenticated: resolve")
            resolve()
          } else {
            console.log("isAuthenticated: reject")
            reject()
          }
        }
      })
    })
  },

  // 跟getUserInfo的实现相比，不能同步返回userInfo
  mygetUserInfo(){
      wx.getSetting({
        success(res) {
          console.log("wx.getUserInfo success")
          if (res.authSetting['scope.userInfo'] === false) {
            // 已拒绝授权
            return null
          } else {
            wx.getUserInfo({
              success(res) {
                const userInfo = res.userInfo
                return userInfo
              }
            })
          }
        }
    })
  },

  formatTime(date, withTime=false) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
   
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    if (withTime == true)
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    else
      return [year, month, day].map(formatNumber).join('-')
    },
}