// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const cartList = event.cartList
  console.log("In addToCart, event: ", event)

  const cartRes = await db.collection('cart').where({user}).get()
  const cartLists = cartRes.data
  console.log("In updateCart, IN cartLists: ", cartLists)

  db.collection('cart').where({
    user,
  }).remove()

  for (let product of cartList){
    console.log("In addToCart, product: ", product)
    await db.collection('cart').add({
      data: {
        productId: product.productId,
        count: product.count,
        user,
        image: product.image,
        name: product.name,
        price: product.price,
      },
    }).then(res => {
      console.log("then res:", res)
    }).catch(err =>{
      console.log("catch err:", err)
    })
  }
  console.log("In getCartList, user: ", user)
  const cartResOut = await db.collection('cart').where({user}).get()
  const cartListsOut = cartResOut.data
  console.log("In updateCart, OUT cartLists: ", cartListsOut)

  return {}
}