// 以iphone6为设计稿，计算相应的缩放比例
const { windowWidth, windowHeight } = wx.getSystemInfoSync();
function createRpx2px() {
  return function (rpx) {
    return windowWidth / 750 * rpx
  }
}

const rpx2px = createRpx2px();
const canvasW = rpx2px(windowWidth * 2 * 2);
const canvasH = rpx2px(windowHeight * 2 * 2);
const radius = rpx2px(90 * 2);
let QRImageX = canvasW / 2 - radius;
let QRImageY = canvasH / 2 + radius / 2;

let localQR = '', localImageBg = '', titleH = rpx2px(420 * 2), titleColor = '#f2f2f2', base64 = '';


function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: resolve,
      fail: reject
    })
  })
}

function canvasToTempFilePath(option, context) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...option,
      success: resolve,
      fail: reject,
    }, context)
  })
}

function saveImageToPhotosAlbum(option) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      ...option,
      success: resolve,
      fail: reject,
    })
  })
}

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(visible) {
        if (visible && !this.beginDraw) {
          console.log(this.properties);
          this.draw()
          this.beginDraw = true
        }
      }
    },
    title: {
      type: String,
      value: ''
    },
    gametype: {
      type: Number,
      value: 0
    },
    gameurl: {
      type: String,
      value: ''
    }
  },

  data: {
    beginDraw: false,
    isDraw: false,

    canvasWidth: windowWidth * 2,
    canvasHeight: windowHeight * 2,

    imageFile: '',

    responsiveScale: 1
  },

  lifetimes: {
    ready() {
      const designWidth = 375
      const designHeight = 603 // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度

      // 以iphone6为设计稿，计算相应的缩放比例
      const { windowWidth, windowHeight } = wx.getSystemInfoSync()
      const responsiveScale =
        windowHeight / ((windowWidth / designWidth) * designHeight)
      if (responsiveScale < 1) {
        this.setData({
          responsiveScale,
        })
      }
    },
  },

  methods: {
    handleClose() {
      this.triggerEvent('close')
    },
    handleSave() {
      const { imageFile } = this.data

      if (imageFile) {
        saveImageToPhotosAlbum({
          filePath: imageFile,
        }).then(() => {
          wx.showToast({
            icon: 'none',
            title: '分享图片已保存至相册',
            duration: 1000,
          })
        }).catch((e) => {
          if (e.errMsg == 'saveImageToPhotosAlbum:fail auth deny' || e.errMsg == "saveImageToPhotosAlbum:fail:auth denied") {
            this.authAlbum();
          }
        })
      }
    },
    // 手机相册授权
    authAlbum() {
      wx.showModal({
        title: '请允许保存到相册',
        content: '需要您授权保存相册',
        showCancel: false,
        success: modalSuccess => {
          wx.openSetting({
            success(settingdata) {
              console.log("settingdata", settingdata)
              if (settingdata.authSetting['scope.writePhotosAlbum']) {
                wx.showModal({
                  title: '提示',
                  content: '获取权限成功,再次点击图片即可保存',
                  showCancel: false,
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '获取权限失败，将无法保存到相册哦~',
                  showCancel: false,
                })
              }
            },
            fail(failData) {
              console.log("failData", failData)
            },
            complete(finishData) {
              console.log("finishData", finishData)
            }
          })
        }
      })
    },
    loadNetworkImage(loadtype, gametype) {
      //loadtype 0为本地图片，1为网络图片
      let ercodeUrl = `https://social.ajihua888.com/v14/public/qrcode?gameurl=${this.properties.gameurl}`;
      if (gametype == 1) {
        localQR = '../../images/games/mrzx.jpg';
        localImageBg = '../../images/games/mrzx@2x.jpg';
        QRImageX = canvasW * 0.6;
        QRImageY = canvasH * 0.63;
        titleH = rpx2px(540 * 2);
        titleColor = '#ffc107';
      } else if (gametype == 2) {
        localQR = '../../images/games/wztz.jpg';
        localImageBg = '../../images/games/wztz@2x.jpg';
        QRImageX = canvasW / 2 - radius;
        QRImageY = canvasH / 2 + radius / 2;
        titleH = rpx2px(400 * 2);
        titleColor = '#ff5722';
      } else if (gametype == 3) {
        localQR = '../../images/games/tzs.jpg';
        localImageBg = '../../images/games/tzs@2x.jpg';
        QRImageX = canvasW / 2 - radius;
        QRImageY = canvasH / 2 + radius / 2;
        titleH = rpx2px(400 * 2);
        titleColor = '#009688';
      } else if (gametype == 4) {
        localQR = '../../images/games/ggzj.jpg';
        localImageBg = '../../images/games/ggzj@2x.jpg';
        QRImageX = canvasW / 2 - radius;
        QRImageY = canvasH / 2 + radius / 2;
        titleH = rpx2px(480 * 2);
        titleColor = '#f2f2f2';
      } else if (gametype == 5) {
        localQR = '../../images/games/jsyx.jpg';
        localImageBg = '../../images/games/jsyx@2x.jpg';
        QRImageX = canvasW / 2 - radius;
        QRImageY = canvasH / 2 + radius / 2;
        titleH = rpx2px(520 * 2);
        titleColor = '#4caf50';
      }
      if (loadtype) {
        wx.downloadFile({
          url: ercodeUrl,
          success(res) {
            if (res.statusCode === 200) {
              ercodeUrl = res.tempFilePath;
            }
          }
        });
        const avatarPromise = getImageInfo(ercodeUrl);
        const backgroundPromise = localImageBg
        return { avatarPromise, backgroundPromise }
      }

      const avatarPromise = localQR
      const backgroundPromise = localImageBg
      return { avatarPromise, backgroundPromise }
    },
    draw() {
      var that = this;
      wx.showLoading();
      const { avatarPromise, backgroundPromise } = this.loadNetworkImage(1, this.properties.gametype);
      //绘制方法

      Promise.all([avatarPromise, backgroundPromise])
        .then(([avatar, background]) => {
          const ctx = wx.createCanvasContext('share', this)
          // 绘制背景
          ctx.drawImage(
            backgroundPromise, //本地模式
            0,
            0,
            canvasW,
            canvasH
          );
          // 绘制头像
          ctx.drawImage(
            avatar.path,
            QRImageX,
            // y - radius,
            QRImageY,
            radius * 2,
            radius * 2,
          );
          // 绘制标题
          const wxs = wx.getSystemInfoSync()
          ctx.setFontSize(wxs.pixelRatio * 28)
          ctx.setTextAlign('center')
          ctx.setFillStyle(titleColor)
          ctx.fillText(
            that.properties.title,
            canvasW / 2,
            titleH,
          )
          ctx.stroke()

          ctx.draw(false, () => {
            canvasToTempFilePath({
              canvasId: 'share',
            }, this).then(({ tempFilePath }) => this.setData({ imageFile: tempFilePath }))
          })

          wx.hideLoading()
          this.setData({ isDraw: true })
        })
        .catch(() => {
          this.setData({ beginDraw: false })
          wx.hideLoading()
        })
    }
  }
})