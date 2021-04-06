// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID

  const orderRes = await db.collection('order').where({user: userId}).get()
  const orderLists = orderRes.data
  return orderLists
}