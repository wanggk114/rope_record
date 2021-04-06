// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  let family_id = ""
  let family_name=""
  let ownerList=[]

  const familyMemRes = await db.collection('rope_family_member').where({member_user: userId}).get() //用户家庭关系
  const familyMemList = familyMemRes.data
  console.log("In addOwner, familyMemList: ", familyMemList)

  if (familyMemList.length>0){  
    family_id = familyMemList[0].family_id
    const familyRes = await db.collection('rope_family').where({_id: family_id}).get()
    const familyList = familyRes.data

    if (familyList.length>0){  //家庭信息
      family_name=familyList[0].family_name
    }

    const ownerRes = await db.collection('rope_owner').where({family_id: family_id}).field({owner:true}).get()
    const ownerLists = ownerRes.data
    ownerLists.forEach(item=>{   //只取owner的值
      ownerList.push(item.owner)
    })
  }

  return {family_id, family_name, ownerList}  
}