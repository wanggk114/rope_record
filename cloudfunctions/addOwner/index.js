// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const owner= event.owner
  let family = event.family
  let family_id=event.family_id
  const isAddFamily = event.isAddFamily
  let   sucess_flag = -1

  console.log("In addOwner, event: ", event)

  if (isAddFamily)
  {
    const familyMemRes = await db.collection('rope_family_member').where({member_user: user}).get()
    const familyMemList = familyMemRes.data
    console.log("In addOwner, familyMemList: ", familyMemList)
    if (familyMemList.length>0){  //用户已存在家庭关系
      family_id = familyMemList[0].family_id
      const familyRes = await db.collection('rope_family').where({_id: family_id}).get()
      const familyList = familyRes.data
      console.log("In addOwner, rope_family: ", familyList)
      if (familyList.length>0){  //用户已存在家庭信息
        family=familyList[0].family_name
        return {"result": {"ret_code": 0,
                          "family_id": family_id,
                          "family_name": family,
                        }}  //返回_id
      }else{  //rope_family_member有值，rope_family无值，rope_family缺数据
        console.log("In addOwner, rope_family is empty!!!")
        return {"result": {"ret_code": -1,
                           "family_id": family_id,
                          }}
      }
    }
    //用户不存在家庭信息时，先增加家庭信息，再建成员关系
    await db.collection('rope_family').add({  
      data:{
        family_name: family,
        createTime: +new Date()
      }
    }).then(res=>{
      console.log("add rope_family res:", res)
      family_id = res._id
      sucess_flag = 1
    }).catch(err=>{
      //没加成功
      sucess_flag = -1
    })

    if (sucess_flag === 1){  //rope_family add sucess
      sucess_flag = -1
      await db.collection('rope_family_member').add({ 
        data:{
          family_id: family_id,
          member_user: user,
          createTime: +new Date()
        }
      }).then(res=>{
        console.log("add rope_family_member OK")
        sucess_flag = 1
      }).catch(err=>{
        //没加成功
        sucess_flag = -1
      })
    }
    
    console.log("sucess_flag=", sucess_flag)
    if (sucess_flag === 1){
      return {"result": {"ret_code": 1,
                          "family_id": family_id,
                          "family_name": family,
                        }}  //返回_id
    }else{
      return {"result": {"ret_code": -1}}
    }
  }else{
    const ownerRes = await db.collection('rope_owner').where({family_id: family_id, owner: owner}).get()
    const ownerList = ownerRes.data
    console.log("In addOwner, ownerList: ", ownerList)
    if (ownerList.length>0){
      return {"result": {"ret_code": 0,}}
    }
  
    await db.collection('rope_owner').add({
      data:{
        family_id:family_id,
        owner: owner,
        createTime: +new Date()
      }
    })
    return {"result": {"ret_code": 1}}
  }

}