// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID

  console.log("In getRopeRecordByDay, event: ", event)

  const recordRes = await db.collection('rope_record').where({
    family_id: event.family_id, 
    day: event.day,
    owner: event.owner
  }).get()
  const recordLists = recordRes.data
  console.log("In getRopeRecordByDay, recordLists: ", recordLists)
  return recordLists
}