// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID

  console.log("In addToRopeRecord, event: ", event)
  console.log("In addToRopeRecord, wxContext: ", wxContext)

  await db.collection('rope_record').where({  //如已有同一天的数据，先删除再插入
    // user: userId, //可能是不同人提交
    family_id: event.family_id,
    owner: event.owner,
    day: event.day
  }).remove()

  if(event.count !== ''){  //count为空时，不插入
    await db.collection('rope_record').add({
      data:{
        user: userId,
        family_id: event.family_id,
        owner: event.owner,
        day: event.day,
        count: event.count,
        createTime: +new Date(),
      }
    })
  }

  return {}
}