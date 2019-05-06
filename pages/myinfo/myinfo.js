// pages/myinfo/myinfo.js

const app = getApp()
var serverName = app.globalData.serverName
var utils = require('../../utils/util.js')
var flag = true;
var type_t = 'lost'
//var publish_data
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: [],
    // list: [],
    listofitem: [],
    listfound: [{ header: ' ' }],
    listlost: [{ header: ' ' },],
    activeIndex: 1,
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    loading: false,
    refresh: 0,
    plain: false,
    actionSheetHidden: true,

  },
  onShow: function(){
    this.onLoad();
  },

  onPullDownRefresh: function () {
    this.onLoad();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  Loadmsg: function (Data) {
    var that = this;
    var i = 0;
    console.log('Data!!!')
    console.log(Data)
    for (i = 0; i < Data.length; i++) {
      var userid = Data[i].user_info.nick_name;
      var Msg = Data[i].content;
      var Submission_time = Data[i].mtime;
      var imageurl = '';
      var user_icon = Data[i].user_info.avatar_url;
      var publish_id = Data[i].dynamic_id;
      var imageList = that.data.publish_data[i].images;
      // var nick_name = that.Data[i].nickName,
      // var avatarUrl = that.Data[i].avatarUrl,
      if (Data[i].images)
        imageurl =Data[i].images[0];
      //   if (that.Data[i].type == 'lost')
      this.data.listfound.push({
        username: userid, text: Msg, image: imageurl, imagelist: imageList, usericon: user_icon, sub_time: Submission_time, publish_id: publish_id
      });
      //   else
      //   this.data.listlost.push({ username: userid, text: Msg, image: imageurl, usericon: user_icon, sub_time: Submission_time });
    }
    this.setData({
      listofitem: this.data.listfound
    })
  },
  photopreview: function (event) {//图片点击浏览
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //console.log(imgList);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  Setting:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['联系方式修改', '退出登录'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          console.log('联系方式修改')
          wx.navigateTo({
            url: '../modifyinfo/modifyinfo',
          })
        }
        else
        {
          that.Logout();
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  Logout:function()//logout注销函数，待写
  {
    
    console.log("logout---------------")
    console.log(wx.getStorageSync('openid'));
    console.log(wx.getStorageSync('user_id'));
    wx.request({
      url: serverName + '/service/user/logout',
      data: {
        openid: wx.getStorageSync('openid'),
        user_id: wx.getStorageSync('user_id')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("---------------")
        console.log(res.data)
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })
  },
  onLoad: function () {
    var user_id = wx.getStorageSync('user_id')
    console.log('userid is ' + user_id);
    
    this.get_current_user_info(user_id);
    this.get_publish_of_mine(user_id);
    wx.showToast({
      title: '下拉可以刷新个人信息',
      icon: 'none'
    })
    console.log(this.data)
   // console.log(publish_data)
    while (this.data.listfound.length != 0)
      this.data.listfound.pop();
    while (this.data.listlost.length != 0)
      this.data.listlost.pop();
    var that = this;

    this.index = 1
    if (this.data.activeIndex == 1)
      this.setData({
        listofitem: this.data.listlost + this.data.listlost,
      })
    else this.setData({
      listofitem: this.data.listlost + this.data.listlost,
    })


    // console.log(this.data)
  },



  //删除函数
  messageDelete: function (e) {
    //TODO:调用函数deleteSingleMassageById(publish_id)
    var that = this;
    wx.showActionSheet({
      itemList: ['确认删除'],
      success(res) {
        console.log(res.tapIndex)
        if(res.tapIndex == 0)
        {
          console.log(e);
          console.log(e.target.dataset.publishId);
          var pubid = e.target.dataset.publishId;
          that.deleteSingleMassageById(pubid);
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },

  deleteSingleMassageById: function (publish_id) {
    var that = this;
    console.log('待删除的消息id为'+publish_id)
    wx.request({
      url: serverName + '/service/dynamic/delete',
      data: {
        dynamic_id: publish_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log('deleteSingleMassageById: success')
        console.log(res.data)
        if (res.data.code == 0) {
          that.onLoad();
        }
      }
    })
  },

  get_current_user_info: function(user_id){

    //传入的user_id如果是当前登录者， 请用user_id: wx.getStorageSync('user_id') 传入
    var that = this
    wx.request({
      url: serverName + '/service/user/getById',
      data: {
        user_id: user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      
      success: function (res) {
        that.setData({
          nickName: res.data.data['nick_name'],
          avatarUrl: res.data.data['avatar_url'],
          contact_type: res.data.data['contact_type'],
          contact_value: res.data.data['contact_value']
        })
      }
    })
    console.log('get_current_user_id....')
    console.log(user_id)
  },

  get_publish_of_mine: function(user_id){

    //传入的user_id如果是当前登录者， 请用user_id: wx.getStorageSync('user_id') 传入
    var that = this
    wx.request({
      url: serverName + '/service/dynamic/show',
      data: {
        user_id: user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(' get_publish_of_mine......')
        console.log(res)
        that.setData({
          publish_data: res.data.data.dynamics
        })
        var publish_data=res.data.data.dynamics;
        that.Loadmsg(publish_data);
      }
    })

  }
})
