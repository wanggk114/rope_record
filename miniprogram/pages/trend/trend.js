import * as echarts from '../../components/ec-canvas/echarts';
const util = require('../../utils/util')
const db = require('../../utils/db')

const app = getApp();

let chartLine;
let g_min=999999;
var option = {
  title: {
    text: '趋势图',
    left: 'center'
  },
  color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
  legend: {
    data: ['Avg', 'Min', 'Max'],
    top: 30,
    left: '30%',
    backgroundColor: 'red',
    // z: 100
  },
  grid: {
    containLabel: true
  },
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    data: [],
    name: '日期',
    // show: false
  },
  yAxis: {
    x: 'center',
    type: 'value',
    name: '次数',
    min: 60,
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
    // show: false
  },
  series: [{
    name: 'Avg',
    type: 'line',
    smooth: true,
    //data: [18, 36, 65, 30, 78, 40, 33],
    data: []
  }, {
    name: 'Min',
    type: 'line',
    smooth: true,
    //data: [12, 50, 51, 35, 70, 30, 20],
    data: []
  }, {
    name: 'Max',
    type: 'line',
    smooth: true,
    //data: [10, 30, 31, 50, 40, 20, 10],
    data: []
  }]
};

function initChart(canvas, width, height, dpr) {
  chartLine = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chartLine);
  chartLine.setOption(option);

  return chartLine;
}


Page({
  onShareAppMessage: function (res) {
    
  },

  data: {
    ec: {
      onInit: initChart
    },
    userInfo: null,
    owner: '',
    recordList: [],
    showDays: 10,  //默认显示10天数据
  },

  onReady() {
  },

  onLoad: function(){
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
      this.getRecords()
    }).catch(err=>{
      console.log('Not Authenticated yet');
      wx.switchTab({
        url:'/pages/me/me'
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    this.getRecords()
    wx.stopPullDownRefresh()
  },

  getRecords(){
    wx.showLoading({
      title: 'Still Loading...',
    })

    let family_id=wx.getStorageSync('family_id')
    let owner=wx.getStorageSync('owner')
    console.log("getRecords:family_id ", family_id)
    console.log("getRecords:owner ", owner)

    db.getRecordByOwner(owner, family_id, false).then( result => {  //desc=false 升序
      wx.hideLoading()
      wx.showToast({
        title: 'Succeed'
      })

      const data = result.result
      //console.log("getRecordByOwner:", data)
      
      if (data){
        data.forEach((record, index, data)=>{
          data[index] = this.get_statistics(record)
        })
        console.log("getRecordByOwner:", data)
        this.setData({
          recordList: data,
          owner: owner,
          showDays: 10 //设回默认值
        })
        this.mySetOption()
      }
    }).catch( err => {
      console.log("getRecordByOwner err:", err)
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: 'Failed',
      })
    })
  },

  mySetOption:function(){
    const owner = this.data.owner
    var data = this.data.recordList.slice(-this.data.showDays)
    console.log("mySetOption data:", data)
    var xData = data.map(item => item.day)
        console.log("xData:", xData)
        chartLine.setOption({
          title: {
            text: owner+'的趋势图'
          },
          xAxis: {
              data: xData,
          }, 
          yAxis: {
            min: g_min>20?Math.floor(g_min/10)*10-20 : 0
          },
          series: [{
              data: data.map(item => item.avg)
          }, {
              data: data.map(item => item.min)
          }, {
            data: data.map(item => item.max)
          }]
        })
  },

  get_statistics: function(record){
    var counts = record.count.split("|")
    var Sum = 0
    var Max = 0
    var Min = 999999
    counts.forEach((count, index, counts)=>{
      count = parseInt(count)
      counts[index] = count
      Sum = Sum + count
      if (Max < count){Max = count}
      if (Min > count){Min = count}
      if (g_min > Min){g_min = Min}  //记录全局最小值
    })
    var Avg = Sum/counts.length
    record['avg']=Avg
    record['max']=Max
    record['min']=Min
    // console.log("record :", record)

    return record
  },

  changeShowDay: function(event){
    console.log("changeShowDay.data:", event.target.dataset)
    const num = event.target.dataset.num
    if (num === "all"){
      this.setData({
        showDays: 0,    // 0 slice时展示所有
      })
    }else{
      this.setData({
        showDays: parseInt(num),
      })
    }
    this.mySetOption()
  },

});
