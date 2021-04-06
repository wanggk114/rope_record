// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  const invt_family_id = event.invt_family_id
  let   family = ''

  console.log("In buildFamilyRel, event: ", event)

  const familyMemRes = await db.collection('rope_family_member').where({member_user: userId}).get() //用户家庭关系
  const familyMemList = familyMemRes.data
  console.log("In buildFamilyRel, familyMemList: ", familyMemList)

  if (familyMemList.length>0){  //用户已存在家庭关系
    let family_id = familyMemList[0].family_id
    const familyRes = await db.collection('rope_family').where({_id: family_id}).get()
    const familyList = familyRes.data
    console.log("In buildFamilyRel, rope_family: ", familyList)
    if (familyList.length>0){  //用户已存在家庭信息
      family=familyList[0].family_name
      return {"result": {"ret_code": 0,
                        "family_id": family_id,
                        "family_name": family,
                      }}  //返回_id
    }else{  //rope_family_member有值，rope_family无值，rope_family缺数据
      console.log("In buildFamilyRel, rope_family is empty!!!")
      return {"result": {"ret_code": -1,
                         "family_id": family_id,
                        }}
    }
  }else{ //根据invt_family_id建立家庭关系
    const familyRes = await db.collection('rope_family').where({_id: invt_family_id}).get()
    const familyList = familyRes.data
    console.log("In buildFamilyRel, rope_family: ", familyList)
    if (familyList.length>0){  //invt_family_id存在家庭信息
      family=familyList[0].family_name
      await db.collection('rope_family_member').add({
        data:{
          family_id: invt_family_id,
          member_user: userId,
          createTime: +new Date()
        }
      }).then(res=>{
          return {"result": 
            {"ret_code": 1,
            "family_id": invt_family_id,
            "family_name": family,
          }
        }  //返回_id
      }).catch(err=>{
        return {"result": {"ret_code": -1}}
      })

    }else{
      console.log("In buildFamilyRel, rope_family is empty!!!")
      return {"result": {"ret_code": -1,
                         "family_id": invt_family_id,
                        }}
    }
  }

  return {"result": {"ret_code": -1}}
}