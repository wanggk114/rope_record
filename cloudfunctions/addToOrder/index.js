// 云函数入口文件
// const cloud = require('../addToCart/node_modules/wx-server-sdk')
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const productList = event.list || []
  const isCheckOut = !!event.isCheckOut

  console.log("In addToOrder, event: ", event)
  console.log("In addToOrder, wxContext: ", wxContext)

  await db.collection('order').add({
    data:{
      user,
      createTime: +new Date(),
      productList
    }
  })

  if (isCheckOut){
    // if it's checked out from cart
    console.log("In addToOrder, productList: ", productList.map(product => product.productId))
    await db.collection('cart').where({
      productId: db.command.in(productList.map(product => product.productId))
    }).remove()
  }

  return {}
}