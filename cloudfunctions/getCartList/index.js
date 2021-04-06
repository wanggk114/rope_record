// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID

  console.log("In getCartList, event: ", userId)

  const cartRes = await db.collection('cart').where({user: userId}).get()
  const cartLists = cartRes.data
  console.log("In getCartList, cartLists: ", cartLists)
  return cartLists
}