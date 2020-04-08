//canvas.js
Page({
  data: {
    windowWidth: 0, //屏幕宽度
    windowHeight: 0, //屏幕高度
    contentHeight: 0, //内容高度
    thinkList: [], //文字超出换行处理
    lineHeight: 30, //固定值
    contentTitle: "iPhone XS Max(256GB) 金色 移动联通电信4G手机 双卡双待", //商品标题
    price: "10999.00", //商品价格
    delPrice: "12999.00", //划线价
    canvasUrl: "", //canvas李彪
    qrCode: "https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/201901310959076784.jpeg", //小程序码https图片路径
    goodsInfoImg: "", //商品图片
    specText: "6.5英寸视网膜全面屏，面容ID" //规格
  },

  onLoad: function(options) {
    let that = this;
    //获取设备信息高度。计算出其他的高度等
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          normalPageX: res.windowWidth - (res.windowWidth + res.windowWidth * 0.72) / 2, //左边文本图片X轴位置
          boxWidth: res.windowWidth * 0.84, //分享图片box宽度
          boxheight: res.windowWidth * (0.222 + 0.72 + 0.192) + 80, //分享图片box高度
          boxPageY: res.windowWidth * 0.081, //boxY轴位置
          imgWidth: res.windowWidth * 0.77, //商品图片宽度
          imgHeight: res.windowWidth * 0.92, //商品图片高度
          imgPageY: res.windowWidth * 0.232, //商品图片Y轴位置
          codeWidth: res.windowWidth * 0.192, //小程序码图片宽度
          codeHeight: res.windowWidth * 0.192, //小程序码图片高度
          codePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 40, //小程序码Y轴位置
          avatarPageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 15, //头像Y轴位置
          titlePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 65, //标题Y轴位置
          specPageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 82, //规格Y轴位置
          pricePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 123, //价格Y轴位置
          timePageY: res.windowWidth * 0.222 + res.windowWidth * 0.72 + 118 //秒杀Y轴位置
        });
      }
    });
    //网络图片转为本地图片，直接显示网络图片的话真机不显示
    that.getTempFile("http://img14.360buyimg.com/n0/jfs/t1/3730/7/3438/394579/5b996f2eE1727c59e/373cf10d42a53b72.jpg");
    // }
  },
  //临时图片路径
  getTempFile: function(url) {
    wx.showLoading({});
    let that = this;
    wx.downloadFile({
      url: url,
      success: function(res) {
        console.log("res.tempFilePath===>", res.tempFilePath)
        that.setData({
          goodsInfoImg: res.tempFilePath
        });
        //继续生成商品的小程序码
        that.downloadSkuQrCode(that.data.qrCode);
      },
      fail: function(err) {}
    });
  },
  getData: function() {
    let that = this;

    let i = 0;
    let lineNum = 1;
    let thinkStr = "";
    let thinkList = [];
    for (let item of that.data.contentTitle) {
      if (item === "\n") {
        thinkList.push(thinkStr);
        thinkList.push("a");
        i = 0;
        thinkStr = "";
        lineNum += 1;
      } else if (i === 21) {
        thinkList.push(thinkStr);
        i = 1;
        thinkStr = item;
        lineNum += 1;
      } else {
        thinkStr += item;
        i += 1;
      }
    }
    thinkList.push(thinkStr);
    that.setData({
      thinkList: thinkList
    });
    that.createNewImg(lineNum);
  },

  //画矩形，也是整块画布的大小，宽度是屏幕宽度，高度根据内容多少来动态设置。
  drawSquare: function(ctx, height) {
    let that = this;
    ctx.rect(
      that.data.windowWidth * 0.08,
      that.data.boxPageY,
      that.data.boxWidth,
      height
    );
    ctx.setFillStyle("#fff");
    ctx.fill();
  },

  // 设置文字大小，并填充颜色。
  drawFont: function(ctx, contentTitle, height) {
    let that = this;
    let str = that.data.contentTitle;
    let firstline;
    let secondline;
    //一行显示14个字，超过一行时
    if (str.length > 23) {
      //第一行截取前14个字符
      firstline = str.substring(0, 23);
      //两行都显示不下
      if (str.length > 46) {
        secondline = str.substr(23, 23) + "...";
      } else {
        //第二行取剩下的
        secondline = str.substr(23, str.length - 23);
      }
    } else {
      //一行就能显示时候
      firstline = str;
    }

    ctx.setFontSize(14);
    ctx.setFillStyle("#000");
    ctx.fillText(firstline, that.data.normalPageX, that.data.titlePageY);
    if (secondline) {
      ctx.setFontSize(12);
      ctx.setFillStyle("#333");
      ctx.fillText(
        secondline,
        that.data.normalPageX,
        that.data.titlePageY + 17
      );
    }
    if (that.data.specText) {
      ctx.setFontSize(12);
      ctx.setFillStyle("#999999");
      ctx.fillText(
        that.data.specText,
        that.data.normalPageX,
        that.data.specPageY + 18
      );
    }
  },
  // 根据文字多少动态计算高度，然后依次画出矩形，文字，横线和小程序码。
  createNewImg: function(lineNum) {
    let that = this;
    let ctx = wx.createCanvasContext("myCanvas");
    let contentHeight = that.data.boxheight;
    that.drawSquare(ctx, contentHeight);
    that.setData({
      contentHeight: contentHeight
    });
    let height = 100;
    for (let item of that.data.thinkList) {
      if (item !== "a") {
        that.drawFont(ctx, item, height);
        height += that.data.lineHeight;
      }
    }
    //商品图片
    ctx.drawImage(
      that.data.goodsInfoImg,
      that.data.normalPageX,
      that.data.imgPageY,
      that.data.imgWidth,
      that.data.imgWidth
    );
    // 填充价格符号￥
    ctx.setFillStyle("#cb4255");
    ctx.font = "normal normal 15px sans-serif";
    ctx.fillText("￥", that.data.normalPageX - 2, that.data.pricePageY);
    // 填充价格文字
    ctx.font = "normal bold 20px sans-serif";
    ctx.fillText(
      that.data.price,
      that.data.normalPageX + 13,
      that.data.pricePageY
    );
    // 计算价格符号￥ + 价格文字宽度
    let priceWidth = ctx.measureText("￥" + that.data.price).width;
    //有划线价，才展示
    if (this.data.delPrice) {
      // 填充划线价文字
      ctx.setFillStyle("#999");
      ctx.font = "normal normal 13px sans-serif";
      ctx.fillText(
        that.data.delPrice,
        that.data.normalPageX + priceWidth,
        that.data.pricePageY
      );
      // 计算划线价宽度
      let delPriceWidth = ctx.measureText(that.data.delPrice).width;
      // 填充划线价横线
      ctx.beginPath();
      ctx.moveTo(
        that.data.normalPageX + priceWidth + 2,
        that.data.pricePageY - 4
      );
      ctx.lineTo(
        that.data.normalPageX + priceWidth + delPriceWidth + 2,
        that.data.pricePageY - 4
      );
      ctx.setStrokeStyle("#999");
      ctx.stroke();
      ctx.closePath();
    }
    // 填充小程序码
    ctx.drawImage(
      that.data.qrCode,
      that.data.normalPageX + that.data.windowWidth * 0.53,
      that.data.codePageY,
      that.data.codeWidth,
      that.data.codeHeight
    );
    // 填充长按立即购买文本
    ctx.setFillStyle("#333");
    ctx.font = "normal normal 9px sans-serif";
    ctx.fillText(
      "长按分享给好友",
      that.data.normalPageX +
      that.data.windowWidth * 0.53 +
      (that.data.codeWidth - 54) / 2,
      that.data.codePageY + that.data.codeWidth + 10
    );
    ctx.draw(); //绘制到canvas
  },

  // 保存图片
  savePic: function() {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 50,
      width: that.data.windowWidth * 2,
      height: that.data.contentHeight * 2,
      canvasId: "myCanvas",
      success: function(res) {
        // util.savePicToAlbum(res.tempFilePath);
        console.log(that.data)
        wx.hideLoading();
        var tempFilePath = res.tempFilePath;
        that.setData({
          canvasUrl: tempFilePath
        });
        if (tempFilePath !== "") {
          wx.hideLoading();
          wx.previewImage({
            current: that.data.canvasUrl, // 当前显示图片的http链接
            urls: [that.data.canvasUrl], // 需要预览的图片http链接列表
            success: function(_res) {
              console.log("预览成功啦");
            }
          });
        }
      }
    });
  },
  //下载小程序码
  downloadSkuQrCode: function(url) {
    let that = this;
    wx.downloadFile({
      url: url,
      success: function(res) {
        that.setData({
          qrCode: res.tempFilePath
        });
        wx.hideLoading();
        //生成数据
        that.getData();
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

  //点击保存到相册
  saveShareImg: function() {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function(res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              // utils.aiCardActionRecord(19);
              wx.showModal({
                content: '图片已保存到相册，赶紧晒一下吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333',
                success: function(res) {
                  if (res.confirm) {}
                },
                fail: function(res) {}
              })
            },
            fail: function(res) {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      });
    }, 1000);
  }
});