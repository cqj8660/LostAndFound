//index.js
//获取应用实例
const app = getApp()
var serverName = app.globalData.serverName
var categories = app.globalData.categories

Page({
  data: {
    array: categories,
    category_index: 0,
    category:'所有',
    type_array:['lost','found'],
    listfound: [{ header: ' ' }],
    listlost: [{ header: ' ' },],
    images: [],
    activeIndex: 1,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData: [],
    publish_id: -1,
    image_exist: 0,
    //图片路径
    tempFilePaths:null,
    //分类按钮
    showModalStatus: false,
    filep:[],
    //导航栏
    navbar: ['LOST', 'FOUND'],
    currentTab: 0,
    imageList: [], 
    tvalue:'',
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
      
    })
  },  
  //单选框触发函数
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    
  },
   //
  stateswitch: function (e) {

    this.setData({
      tvalue:'',
      imageList:[],
      category_index:0,
    })
  },

  //事件处理函数
  bindViewTap: function () {

  },

  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 3,
      success: function (res) {
        console.log('chooseimage.......')
        console.log(res)
        var tmpfile = res.tempFilePaths;
        console.log(tmpfile);
        that.setData({
          imageList: tmpfile,
          filep:tmpfile
        })
        console.log(that.data.imageList);
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    console.log('current')
    console.log(current)
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index_val = this.data.array[e.detail.value]
    this.setData({
      category_index: e.detail.value,
      category: index_val
    })
    console.log('category_index:')
    console.log(this.data.category_index)
    console.log(this.data.category)
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },


  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    console.log(e);
    var that = this;
    var formData = e.detail.value;
    var user_id = wx.getStorageSync('user_id')
    var type_t = this.data.type_array[this.data.currentTab]
    var category = this.data.category
    var title = ''
    var msg = e.detail.value.input
    var imagesPaths = this.data.filep
    console.log('我要发布啦！！！',user_id, type_t, category, title, msg, imagesPaths)
    console.log("imageList..........")
    console.log(imagesPaths)
    //在此调用uploadAll接口
    this.uploadAll(user_id, type_t, category, title, msg, imagesPaths,[])
  },

  //imagesPaths图片路径数组
  updatePhoto: function (dynamic_id, images){
    console.log("imagesurl列表为")
    console.log(images.length) 
    var imageurls = JSON.stringify(images);
    console.log(imageurls);
    wx.request({
      url: serverName + '/service/dynamic/update',
      method: 'POST',
      data: {
        dynamic_id: dynamic_id,
        images: imageurls
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (e) {
        console.log('修改上传图片')
        console.log(e)
      }
    })
  },
  uploadAll: function (user_id, type_t, category, title, msg, imagesPaths) {
    var publish_id=null;
    var that = this;
    wx.request({
      url: serverName + '/service/dynamic/creater',
      data: {
        user_id: user_id,
        type: type_t,
        category: category,
        content: msg,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == 0)
        {
          var dynamic_id = res.data.data.dynamic_id;
          console.log('当前发布的动态id为',dynamic_id);
          var temp = [];
        for (var path in imagesPaths){
          console.log(path)
          
          wx.uploadFile({
            url: serverName + '/service/upload/uploadImg',
            filePath: imagesPaths[path],
            name: "images",
            success: function (res) {
              console.log('图片上传！')
              var fdata = JSON.parse(res.data).data;
              fdata = JSON.parse(fdata)
              temp.push(fdata[0])
              console.log(temp);
              if(temp.length == imagesPaths.length)
                that.updatePhoto(dynamic_id,temp);
            },
            fail: function (err) {
              console.log(err)
            }
          })
          
        }
        //跳转到主页
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            setTimeout(function () {
              page.onLoad();
            }, 2000);

          }
        })
        }
        // publish_id=res.data.data.publish_id;
        // console.log('当前数据库返回的publish_id')
        // console.log(publish_id)


        
        
      }
    })
  },
  onShow: function () {
    
  },
})
