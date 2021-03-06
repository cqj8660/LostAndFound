//index.js
//获取应用实例

var app = getApp()
var utils = require('../../utils/util.js')
var flag = true;

var that = this;
var serverName = app.globalData.serverName
Page({
  data: {
    check: true,//判断是否是测试账号
    type_t: 'found',
    swiper_url: [
      '../../images/index/swiper/1.jpg',
      '../../images/index/swiper/2p.jpg',
      '../../images/index/swiper/3.jpeg',
      '../../images/index/swiper/4.jpg'
    ],
    listofitem: [],
    listfound: [{ header: ' ' }],
    listlost: [{ header: ' ' },],
    cur_type:'所有',
    activeIndex:1,
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    loading: false,
    refresh:0,
    plain: false,
    actionSheetHidden: true,
    actionSheetItems: ['所有']


  },
  search: function (event,userid) {
    wx.navigateTo({
      url: "../search/search"
    })
  },
  bind所有: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '所有',
      listofitem:[]
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind校园卡: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '校园卡',
      listofitem: []})
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind钱包: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '钱包',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind钥匙: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '钥匙',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind雨伞: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '雨伞',
      listofitem: []
    })
    this.show_publish_infos( this.data.type_t, this.data.cur_type, this)
  },
  bind证件: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '证件',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  bind其他: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      cur_type: '其他',
      listofitem: []
    })
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
  },
  actionSheetTap: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function (e) {
    console.log('change', e);
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //事件处理函数
  refresh: function (e){
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    console.log('refresh');
    console.log(this.data.listfound);
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    console.log(this.data.listlost);
    var that = this;
    console.log(this.data.activeIndex);
    this.index = 1
    if(this.data.activeIndex==1)
    this.setData({
      listofitem: this.data.listfound,
      cur_type: '所有'

    })
    else
      this.setData({
        listofitem: this.data.listlost,
        cur_type: '所有'
      })

    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.show_publish_infos(this.data.type_t, '所有', this)
  }, 

  stateswitch: function (e) {
    var that = this;
    var type = e.target.dataset.index;
    if (type == 0) {
      this.setData({
        listofitem: this.data.listlost,
        activeIndex:type,
        type_t:'lost',
        cur_type:'所有'
      })
      flag = false;

    }
    else {
      this.setData({
        listofitem: this.data.listfound,
        activeIndex: type,
        type_t:'found',
        cur_type: '所有'
      })
      flag = true;
    }
    this.show_publish_infos(this.data.type_t, this.data.cur_type, this)
    //console.log(that.data.publish_data);
  },

  bindViewTap: function (e) {

  },

  loadMore: function (e) {
  },
  getNextDate: function () {
    var now = new Date()
    now.setDate(now.getDate() - this.index++)
    return now
  },
  Loadmsg: function () {
    var that = this;
    while (this.data.listfound.length != 1)
      this.data.listfound.pop();
    while (this.data.listlost.length != 1)
      this.data.listlost.pop();
    var i = 0;
    for (i = 0; i < that.data.publish_data.length; i++) {
      var Msg = that.data.publish_data[i].content;
      var user_id = that.data.publish_data[i].user_id;
      var str = that.data.publish_data[i].ctime;
      var Submission_time = str.substring(5, 10) + " " + that.data.publish_data[i].ctime.substring(11, str.length - 1);
      var imageurl = '';
      var imageList = (that.data.publish_data[i].images);
      var user_icon = that.data.publish_data[i].user_info.avatar_url;
      var nick_name = that.data.publish_data[i].user_info.nick_name;
      var location = that.data.publish_data[i].location;
      var type = that.data.publish_data[i].category;
      var address = location.address;
      if(address)
        address = "#"+ type + " #"+address;
      else
        address = "#" + type;
      if (that.data.publish_data[i].images)
        imageurl =that.data.publish_data[i].images[0];
      if (that.data.publish_data[i].type == 'found')
        this.data.listfound.push({
          userid:user_id,username: nick_name, text: Msg, imagelist:imageList,image: imageurl, usericon: user_icon, sub_time: Submission_time, address: address
        })
      else
        this.data.listlost.push({ userid: user_id, username: nick_name, text: Msg, imagelist: imageList, image: imageurl, usericon: user_icon, sub_time: Submission_time, address: address });
    }
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listfound
      })
    else this.setData({
      listofitem: this.data.listlost
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://lostandfound.yiwangchunyu.wang/service/dynamic/categories',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data.data);
        var tempList = ['所有'];
        for(var i = 0; i < res.data.data.length; i++)
          tempList.push(res.data.data[i]);
        that.setData({
          actionSheetItems: tempList
        })
      }
    })
  },
  onPullDownRefresh: function () {
    this.onload;
    this.refresh();
  },
  photopreview: function (event){//图片点击浏览
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //console.log(imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  onLoad: function () {
    var user_id = wx.getStorageSync('user_id');
    console.log(user_id);
    while(this.data.listfound.length!=1)
      this.data.listfound.pop();
    while (this.data.listlost.length!= 1)
      this.data.listlost.pop();
    var that = this;

    this.index = 1
    if (this.data.activeIndex == 1)
    this.setData({
      listofitem: this.data.listfound,
      cur_type: '所有'
    })
    else this.setData({
      listofitem: this.data.listlost,
      cur_type: '所有'
    })

    
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.show_publish_infos('found', '所有', this)
    // console.log(this.data)
  },
  
  //获取发布信息的接口，传入分类数据
  show_publish_infos: function(type_t, category, obj){
    console.log('type_t:'+ type_t);
    console.log('category:' + category);
    if(category == '所有')
      wx.request({
        url: serverName + '/service/dynamic/show',
        data: {
          type: type_t,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          obj.setData({
            publish_data: res.data.data.dynamics
          })
          // console.log('当前数据库返回的publish记录')
          // console.log(res)
          obj.Loadmsg()
        }
      })
      else
      wx.request({
        url: serverName + '/service/dynamic/show',
        data: {
          type: type_t,
          category: category
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          obj.setData({
            publish_data: res.data.data.dynamics
          })
          // console.log('当前数据库返回的publish记录')
          // console.log(res)
          obj.Loadmsg()
        }
      })
  },
})
