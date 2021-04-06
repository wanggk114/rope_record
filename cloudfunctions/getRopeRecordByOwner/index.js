// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  const desc = event.desc

  console.log("In getRopeRecordByOwner, event: ", event)

  let recordRes
  if (desc === true) {
    recordRes = await db.collection('rope_record').where({
      family_id: event.family_id, 
      owner: event.owner
    }).orderBy('day','desc').get()
  }else{
    recordRes = await db.collection('rope_record').where({
      family_id: event.family_id, 
      owner: event.owner
    }).orderBy('day','asc').get()
  }
  
  const recordtLists = recordRes.data
  console.log("In getRopeRecordByOwner, recordtLists: ", recordtLists)
  return recordtLists
}