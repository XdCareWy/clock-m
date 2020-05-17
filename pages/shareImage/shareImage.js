// pages/shareImage/shareImage.js
const app = getApp();
const {
  paintRect,
  paintText,
  splitMultiLine
} = require("../../utils/util.js");
Page({
  data: {
    windowWidth: 0, //屏幕宽度
    windowHeight: 0, //屏幕高度
    restWeek: 0, // 剩余周
    schoolName: "@大树培训学校", // 学校名
    schoolIcon: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI8AOs9GU2QObPQNfjWjpibhjWibbyqqibwJd9WbtomrVahicsObr6o0BcXm3thvodJ0hESiboDy0F3iciaQ/132",
    acatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI8AOs9GU2QObPQNfjWjpibhjWibbyqqibwJd9WbtomrVahicsObr6o0BcXm3thvodJ0hESiboDy0F3iciaQ/132",
    teacherName: "张三丰",
    teacherIntro: "3年教龄，资深物理教师",
    teacherSlogan: "教学的艺术不在于传授本领，而在善于激励、唤醒和鼓舞",
    studentName: "某某生",
    studentSlogan: "我在@大树培训学校跟「周老师」的物理课已经一学期了，在周老师的耐心辅导下，学习很轻松，进步很快！特别推荐他的物理课，你会发现物理真的So Easy^_^",
    qrCode: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI8AOs9GU2QObPQNfjWjpibhjWibbyqqibwJd9WbtomrVahicsObr6o0BcXm3thvodJ0hESiboDy0F3iciaQ/132',
  },

  onLoad: function(options) {
    // todo: 读取api接口
    console.log(options)
    const {schoolIcon,qrCode,acatarUrl,teacherIntro,studentName,studentSlogan,teacherName,teacherSlogan, schoolName,restWeek} = options
    this.setData({
      schoolName,
      studentName,
      studentSlogan,
      teacherName,
      teacherSlogan,
      teacherIntro,
      schoolIcon,
      acatarUrl,
      qrCode,
      restWeek,
    });
    // 获取屏幕的宽、高
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        });
      },
    });
    this.getTempFile(this.data.acatarUrl);
  },
  //临时图片路径
  getTempFile: function(url) {
    wx.showLoading({});
    let that = this;
    wx.downloadFile({
      url: url,
      success: function(res) {
        that.setData({
          acatar: res.tempFilePath
        });
        //继续生成商品的小程序码
        that.downloadSkuQrCode(that.data.qrCode);
      },
      fail: function(err) {}
    });
  },
  //下载小程序码
  downloadSkuQrCode: function(url) {
    let that = this;
    wx.downloadFile({
      url: url,
      success: res => {
        console.log(res)
        that.setData({
          qrCode: res.tempFilePath
        });
        //继续生成学校图片数据
        that.downloadSchoolIcon(that.data.schoolIcon);
      },
      fail: function(err) {
        wx.showToast({
          title: "下载商品码失败,稍后重试！",
          icon: "none",
          duration: 5000
        });
      }
    });
  },
  //下载学校图片
  downloadSchoolIcon: function(url) {
    let that = this;
    wx.downloadFile({
      url: url,
      success: res => {
        console.log(res)

        that.setData({
          schoolIcon: res.tempFilePath
        });
        wx.hideLoading();
        //生成数据
        that.handleCanvas();
      },
      fail: function(err) {
        wx.showToast({
          title: "下载学校图标失败,稍后重试！",
          icon: "none",
          duration: 5000
        });
      }
    });
  },
  // 画顶部部分
  paintTopSection: function(ctx, params) {
    const now = new Date();
    const [year, month, day] = [
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    ];
    const {
      windowWidth,
      windowHeight,
      schoolName,
      restWeek
    } = this.data;
    //  1. 画顶部
    // 画背景
    paintRect(ctx, {
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowHeight * 0.192,
      bgColor: "#69CB95",
    });

    // 画@学学校名
    paintText(ctx, schoolName, {
      x: windowWidth * 0.05,
      y: windowHeight * 0.032,
      fontSize: windowWidth * 0.0338,
    });
    // 画当前时间 - 年月
    const computeMonth = month < 10 ? `0${month}` : month;
    paintText(ctx, `${year}年${computeMonth}月`, {
      x: windowWidth * 0.49,
      y: windowHeight * 0.157,
      fontSize: windowWidth * 0.0338,
      textColor: "white",
    });
    // 画当前时间 - 天
    paintText(ctx, day < 10 ? `0${day}` : day, {
      x: windowWidth * 0.479,
      y: windowHeight * 0.04,
      fontSize: windowWidth * 0.1787,
      textColor: "white",
    });
    // 剩余时间的外矩形边框
    paintRect(ctx, {
      x: windowWidth * 0.7,
      y: windowHeight * 0.056,
      width: windowWidth * 0.266,
      height: windowHeight * 0.123,
      bgColor: "white",
    });
    // 画剩余时间
    paintText(ctx, "距高考", {
      x: windowWidth * 0.726,
      y: windowHeight * 0.0673,
      fontSize: windowWidth * 0.0676,
      textColor: "black",
    });
    paintText(ctx, `剩${restWeek}周`, {
      x: windowWidth * 0.726,
      y: windowHeight * 0.122,
      fontSize: windowWidth * 0.0676,
      textColor: "black",
    });
  },
  // 画中间部分
  paintMiddleSection: function(ctx, params) {
    // 加载并缓存图片
    const {
      acatar,
      windowHeight,
      windowWidth,
      teacherName,
      teacherIntro,
      teacherSlogan,
      qrCode,
      schoolIcon
    } = this.data;

    // 2.1 画昵称
    paintText(ctx, teacherName, {
      x: windowWidth * 0.5,
      y: windowHeight * 0.481,
      bgColor: "black",
      textAlign: "center",
      fontSize: windowWidth * 0.0483,
    });
    // 2.2 画简介
    paintText(ctx, teacherIntro, {
      x: windowWidth * 0.5,
      y: windowHeight * 0.526,
      bgColor: "black",
      textAlign: "center",
      fontSize: windowWidth * 0.029,
    });

    //  画宣传语边框
    paintRect(ctx, {
      x: windowWidth * 0.0483,
      y: windowHeight * 0.561,
      width: windowWidth * 0.903,
      height: windowHeight * 0.0544,
      bgColor: '#69CB95'
    });
    //  画宣传语
    paintText(ctx, teacherSlogan, {
      x: windowWidth * 0.5,
      y: windowHeight * 0.577,
      textAlign: 'center',
      fontSize: windowWidth * 0.029,
      textColor: 'white'
    });
    // 画底部
    this.paintBottomSection(ctx);
    // 顶部学校下的图片
    ctx.drawImage(
      schoolIcon,
      windowWidth * 0.08,
      windowHeight * 0.065,
      windowWidth * 0.179,
      windowWidth * 0.179
    );
    // 二维码
    ctx.beginPath();
    ctx.drawImage(
      qrCode,
      windowWidth * 0.7,
      windowHeight * 0.682,
      windowWidth * 0.229,
      windowWidth * 0.229
    );
    //  画头像(最后画，要不会覆盖掉后面的内容)
    ctx.beginPath();
    ctx.arc(
      windowWidth / 2,
      windowHeight * 0.345,
      windowWidth * 0.16,
      0,
      2 * Math.PI
    );
    ctx.setLineWidth(windowWidth * 0.018);
    ctx.setStrokeStyle("#69CB95");
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(
      acatar,
      windowWidth / 2 - windowWidth * 0.16,
      windowHeight * 0.345 - windowWidth * 0.16,
      windowWidth * 0.319,
      windowWidth * 0.319
    );
    ctx.draw();
    wx.showToast({
      title: "长按保存到相册后，就可以分享到朋友圈了哦~",
      icon: "none",
      duration: 3000
    });
  },
  paintBottomSection: function(ctx, params) {
    const {
      studentName,
      windowWidth,
      windowHeight,
      studentSlogan,
      acatarUrl
    } = this.data;
    // 画文字
    paintText(ctx, `我是「${studentName}」`, {
      x: windowWidth * 0.0483,
      y: windowHeight * 0.641,
      fontSize: windowWidth * 0.058,
      bgColor: "black",
    });
    // 感谢语
    let studentSloganWidth = windowWidth * 1.062;
    let studentSloganHeight = 0;
    if (studentSlogan) {
      const {
        lines
      } = splitMultiLine(ctx, studentSlogan, studentSloganWidth);
      studentSloganHeight = (lines.length + 1) * windowWidth * 0.038;
      // 感谢语外边框
      paintRect(ctx, {
        x: windowWidth * 0.0483,
        y: windowHeight * 0.71 - windowWidth * 0.019,
        width: windowWidth * 0.574,
        height: studentSloganHeight,
        bgColor: "#69CB95"
      });
      // 循环画出感谢语文本
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        paintText(ctx, line, {
          x: windowWidth * 0.0724,
          y: windowHeight * 0.71 + i * windowWidth * 0.038,
          textColor: 'white',
          fontSize: windowWidth * 0.029
        });
      }
    }


  },
  handleCanvas: function() {
    const that = this;
    const ctx = wx.createCanvasContext("shareCanvas");
    const {
      windowHeight,
      windowWidth
    } = this.data;
    paintRect(ctx, {
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowHeight,
      bgColor: "white",
    });
    // 画顶部
    this.paintTopSection(ctx);
    // 画中间
    this.paintMiddleSection(ctx);
  },
  // 保存图片
  savePic: function() {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.windowHeight * 2,
      height: that.data.windowHeight * 2,
      canvasId: "shareCanvas",
      success: function(res) {
        // util.savePicToAlbum(res.tempFilePath);
        wx.hideLoading();
        var tempFilePath = res.tempFilePath;
        console.log(res);
        that.setData({
          canvasUrl: tempFilePath,
        });
        if (tempFilePath !== "") {
          wx.hideLoading();
          wx.previewImage({
            current: that.data.canvasUrl, // 当前显示图片的http链接
            urls: [that.data.canvasUrl], // 需要预览的图片http链接列表
            success: function(_res) {
              console.log("预览成功啦");
            },
          });
        }
      },
    });
  },
  //点击保存到相册
  saveShareImg: function() {
    var that = this;
    wx.showLoading({
      title: "正在保存",
      mask: true,
    });
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: "shareCanvas",
        success: function(res) {
          console.log(res);
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              // utils.aiCardActionRecord(19);
              wx.showModal({
                content: "图片已保存到相册，赶紧晒一下吧~",
                showCancel: false,
                confirmText: "好的",
                confirmColor: "#333",
                success: function(res) {
                  if (res.confirm) {}
                },
                fail: function(res) {},
              });
            },
            fail: function(res) {
              wx.showToast({
                title: res.errMsg,
                icon: "none",
                duration: 2000,
              });
            },
          });
        },
      });
    }, 1000);
  },
});