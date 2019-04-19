// pages/login/login.js
const app = getApp()
var serverName = app.globalData.serverName

Page({
  data: {
    items: [
      { name: 'stu', value: '用户' },
      { name: 'admin', value: '管理员', checked: 'true' },
    ],
    focus: false,
    inputValue: '',
    userInfo: null,
    openid: '',
    user_type: 'stu',
    code:' '
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      user_type: e.detail.value
    })
    console.log(this.data.user_type);
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindPwdInput: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  bindGetUserInfo: function(e) {
    console.log('bindgetuserinfo 调用')
    // console.log(e);
    this.wxLogin();
  },
  wxLogin: function(e) {
    var that = this;
    // console.log(app.globalData.userInfo);
    //获得用户的openid
    wx.login({
      success: function (res) {
        console.log(res);//获取code
        wx.request({
          url: 'https://lostandfound.yiwangchunyu.wang/service/user/getOpenid',
          data: {
            js_code: res.code,//获取openid和session_key
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            // console.log(res.data.data.openid);
            wx.setStorageSync('openid', res.data.data.openid);
          }
        })
      }
    })

    var openid = wx.getStorageSync('openid');
    wx.request({
      url: 'https://lostandfound.yiwangchunyu.wang/service/user/loginByUid',
      data: {
        openid: openid,
        user_id: that.data.inputValue,
        password: that.data.pwd,
        avatar_url: app.globalData.userInfo.avatarUrl
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(e){
        console.log('2345')
        console.log(e);

        if(e.data.code == 0){
          wx.setStorageSync('user_id', e.data.data.user_id);
          if(e.data.data.contact_type){
            wx.switchTab({
              url: '../index/index'
            })
          }
          else{
                wx.redirectTo({
      url: '../initinfo/initinfo'
    })
          }
        }
      }
    })
  } ,
  formSubmit: function(e) {
    //TODO:表单检查
    console.log(this.data);
    //DONE:表单检查
    // console.log(e.detail.value)


  },

  onLoad: function() {
    console.log("login onLoad...")
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo
    })
    var openid = wx.getStorageSync('openid');
    console.log(openid);
    if(openid){
      wx.request({
        url: 'https://lostandfound.yiwangchunyu.wang/service/user/loginByOpenid',
        method: 'POST',
        data: {
          openid: openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (e) {
          console.log(e);
          if(e.data.code == 0){
            wx.setStorageSync('user_id', e.data.user_id);
            wx.switchTab({
              url: '../index/index'
            })
          }
        }

      })
    }

  },


  register: function(user_id, user_password, openid, nickName, avatarUrl) {
    wx.request({
      url: serverName + '/login/register.php',
      data: {
        user_id: user_id,
        user_password: user_password,
        openid: openid,
        nickName: nickName,
        avatarUrl: avatarUrl,
        user_type: this.data.user_type
      },
      method: 'GET', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("register");
        console.log(res);
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        if (res.data.data.tag == 'unregistered') {
          wx.setStorageSync('user_id', user_id);
          wx.redirectTo({
            url: '../initinfo/initinfo'
          })
        } else if (res.data.data.tag == 'registered') {
          wx.setStorageSync('user_id', user_id);

          console.log('-----')
          wx.switchTab({
            url: '../index/index'
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 5000
          })
        }
      }
    })
  }
})