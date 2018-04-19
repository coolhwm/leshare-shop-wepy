import wepy from 'wepy';
import tips from './Tips';

/**
 * 画布工具类
 */
export default class Canvas {
  context = '';

  /**
   * 创建画布
   * */
  static createCanvasContext(canvasName) {
    if (canvasName == null || canvasName == '') {
      return;
    }
    this.context = wepy.createCanvasContext(canvasName);
  }

  /**
   * 画布设置大小颜色
   * */
  static setCanvas(canvasColor, canvasPadding, canvasWidth, canvasHeight) {
    this.context.setFillStyle(canvasColor);
    this.context.fillRect(
        canvasPadding,
        canvasPadding,
        canvasWidth + 2,
        canvasHeight);
  }

  /**
   * 圆角矩形
   * */
  static canvasDrawRoundRect (color, padding, height, wight) {
    // Draw coordinates
    this.context.beginPath();
    this.context.arc(padding + 10, padding, 10, 1.0 * Math.PI, 1.5 * Math.PI);
    this.context.arc(padding - 10 + wight, padding, 10, 1.5 * Math.PI, 0);
    this.context.arc(padding - 10 + wight, padding + height - 20, 10, 0, 0.5 * Math.PI);
    this.context.arc(padding + 10, padding + height - 20, 10, 0.5 * Math.PI, 1.0 * Math.PI);
    this.context.setFillStyle(color);
    this.context.fill();
  }

  /**
   * 画笔文字绘制工具
   * */
  static canvasTextLeft(padding, text, size, color, x, y) {
    this.context.setFillStyle(color);
    this.context.setTextAlign('left');
    this.context.setFontSize(size);
    this.context.fillText(text, x + padding, y + padding);
  }
  static canvasTextCenter(padding, text, size, color, x, y) {
    this.context.setFillStyle(color);
    this.context.setTextAlign('center');
    this.context.setFontSize(size);
    this.context.fillText(text, x + padding, y + padding);
  }
  /**
   *直线工具
   * */
  static fillRect(params) {
    this.context.setFillStyle(params.color);
    this.context.fillRect(
        params.x,
        params.y,
        params.width,
        params.height)
  }

  /**
   * 图片绘制工具
   * */
  static canvasImage(param) {
    this.context.drawImage(
        param.tempFilePath,
        param.x + param.padding,
        param.y + param.padding,
        param.imageWidth,
        param.imageHeight);
  }

  /**
   * 保存图片
   * */
  static saveImage(canvasId) {
    wx.canvasToTempFilePath({
      canvasId: canvasId,
      success(res) {
        console.info('save success', res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(info) {
            console.info('saveImageToPhotosAlbum success', info);
            tips.success('保存成功');
          },
          fail(error) {
            console.error(error);
            if (error.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
              tips.error('请授权');
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  tips.success('授权成功');
                },
                fail(error) {
                  console.error(error);
                  tips.error('授权失败');
                  wx.openSetting({
                  })
                }
              })
            } else {
              tips.error('保存失败');
            }
          }
        })
      }
    });
  }

  /**
   * 选择模板
   * */
  static async chooseShareTemplate(params) {
    console.log(params);
    if (params.canvasName == 'goodsShare') {
      this.goodsShareTemplete(params);
    }
    if (params.canvasName == 'shopCanvas') {
      this.shopShareTemplete(params);
    }
    if (params.canvasName == 'groupShare') {
      this.inviteShareTemplete(params);
    }
    if (params.canvasName == 'superPoster') {
      this.superPosterTemplete(params);
    }
  }

  /**
   * 商品分享的画布模板
   * */
  static async goodsShareTemplete(params) {
    // 图片
    const image = await wepy.downloadFile({url: params.detail.imageUrl});
    image.x = 10;
    image.y = 10;
    image.imageWidth = params.canvasWidth - 20;
    image.imageHeight = params.canvasWidth - 20;
    image.padding = params.canvasPadding;
    // 二维码
    const code = await wepy.downloadFile({url: params.code.message});
    code.x = params.canvasWidth * 0.7;
    code.y = params.canvasHeight * 0.75;
    code.imageWidth = params.canvasWidth * 0.25;
    code.imageHeight = params.canvasWidth * 0.25;
    code.padding = params.canvasPadding;
    // 创建基本画布
    this.createCanvasContext(params.canvasName);
    // 绘制画布
    this.canvasDrawRoundRect('#ffffff', params.canvasPadding, params.canvasHeight, params.canvasWidth);
    // 绘制图片
    this.canvasImage(image);
    // 绘制店铺名称
    this.canvasTextLeft(
        params.canvasPadding,
        params.detail.name,
        params.canvasWidth * 0.05,
        '#3b3a3a',
        10,
        params.canvasHeight * 0.7);
    this.canvasTextLeft(
        params.canvasPadding,
        params.detail.feeText,
        params.canvasWidth * 0.04,
        '#454545',
        10,
        params.canvasHeight * 0.76);
    this.canvasTextLeft(
        params.canvasPadding,
        '￥' + params.detail.sellPrice,
        params.canvasWidth * 0.07,
        '#ff3b3b',
        10,
        params.canvasHeight * 0.9);
    this.canvasTextCenter(
        params.canvasPadding,
        '扫描二维码进入商品详情',
        params.canvasWidth * 0.03,
        '#454545',
        params.canvasWidth / 2,
        params.canvasHeight * 0.96);
    // 绘制二维码
    this.canvasImage(code);
    this.context.draw();
  }
  /**
   * 店铺分享的画布模板
   * */
  static async shopShareTemplete(params) {
    // 图片
    const image = await wepy.downloadFile({url: params.shop.images[0]});
    image.x = 10;
    image.y = 10;
    image.imageWidth = params.canvasWidth - 20;
    image.imageHeight = params.canvasHeight * 0.7;
    image.padding = params.canvasPadding;
    // 二维码
    const code = await wepy.downloadFile({url: params.code.message});
    code.x = params.canvasWidth * 0.7;
    code.y = params.canvasHeight * 0.75;
    code.imageWidth = params.canvasWidth * 0.25;
    code.imageHeight = params.canvasWidth * 0.25;
    code.padding = params.canvasPadding;
    // 创建基本画布
    this.createCanvasContext(params.canvasName);
    // 绘制画布
    this.setCanvas('#FFFFFF', params.canvasPadding, params.canvasWidth, params.canvasHeight);
    // 绘制图片
    this.canvasImage(image);
    // 绘制店铺名称
    this.canvasTextLeft(
        params.canvasPadding,
        params.shop.name,
        params.canvasWidth * 0.06,
        '#000000',
        10,
        params.canvasHeight * 0.8);
    this.canvasTextLeft(
        params.canvasPadding,
        params.shop.address,
        params.canvasWidth * 0.04,
        '#454545',
        10,
        params.canvasHeight * 0.85);
    this.canvasTextLeft(
        params.canvasPadding,
        params.shop.phone,
        params.canvasWidth * 0.04,
        '#454545',
        10,
        params.canvasHeight * 0.9);
    // 绘制二维码
    this.canvasImage(code);
    this.context.draw();
  }
  /**
   * 邀请卡分享的画布模板
   * */
  static async inviteShareTemplete(params) {
    // 图片
    const shareBg = {};
    shareBg.tempFilePath = '/images/icons/share-bg.jpg';
    shareBg.imageWidth = params.canvasWidth;
    shareBg.imageHeight = params.canvasHeight;
    // 创建基本画布
    this.createCanvasContext('groupShare');
    // 绘制图片
    this.canvasImage(shareBg);

    const fillRectParams = {
      color: '#FFFFFF',
      x: params.canvasWidth * 0.05,
      y: params.canvasWidth * 0.05,
      width: params.canvasWidth * 0.9,
      height: params.canvasHeight * 0.93
    };
    this.fillRect(fillRectParams);

    // 图片
    const goodsImage = await wepy.downloadFile({url: 'http://static.pig66.com/uploadfile/2017/0509/20170509080749841.jpg'});
    goodsImage.x = params.canvasWidth * 0.15;
    goodsImage.y = params.canvasHeight * 0.1;
    goodsImage.imageWidth = params.canvasWidth / 3.5;
    goodsImage.imageHeight = params.canvasWidth / 3.5;
    goodsImage.padding = 0;
    this.canvasImage(goodsImage);

    this.canvasTextCenter(0, '团分享-测试', params.canvasWidth * 0.043, '#000000', params.canvasWidth * 0.6, params.canvasHeight * 0.13);
    this.canvasTextCenter(0, '￥ 0.01', params.canvasWidth * 0.04, '#ff3644', params.canvasWidth * 0.545, params.canvasHeight * 0.18);
    this.canvasTextCenter(0, '原价: ￥ 1', params.canvasWidth * 0.027, '#c7c7c7', params.canvasWidth * 0.545, params.canvasHeight * 0.21);
    this.canvasTextCenter(0, '2人成团', params.canvasWidth * 0.035, '#ff3644', params.canvasWidth * 0.545, params.canvasHeight * 0.28);
    this.canvasTextCenter(0, '成团截止日期 02-25 18:30', params.canvasWidth * 0.04, '#ff3644', params.canvasWidth * 0.5, params.canvasHeight * 0.4);

    const lineParams = {
      color: '#ff3644',
      x: params.canvasWidth * 0.25,
      y: params.canvasHeight * 0.425,
      width: params.canvasWidth * 0.5,
      height: params.canvasHeight * 0.002
    };
    this.fillRect(lineParams);

    this.canvasTextCenter(0, '已有1人参加，剩余1个名额。', params.canvasWidth * 0.03, '#454545', params.canvasWidth * 0.5, params.canvasHeight * 0.47);
    this.canvasTextCenter(0, '快来参加吧！', params.canvasWidth * 0.03, '#454545', params.canvasWidth * 0.5, params.canvasHeight * 0.5);

    // 二维码
    const code = await wepy.downloadFile({url: params.code.message});
    code.x = params.canvasWidth * 0.25;
    code.y = params.canvasHeight * 0.55;
    code.imageWidth = params.canvasWidth * 0.5;
    code.imageHeight = params.canvasWidth * 0.5;
    code.padding = 0;
    this.canvasImage(code);

    this.context.draw();
  }
  /**
   * 超级海报
   * */
  static async superPosterTemplete(params) {
    console.info('[inviate] invite poster params=', params);
    // 图片
    const shareBg = await wepy.downloadFile({url: 'http://img.leshare.shop/super_canvas.png'});
    shareBg.imageWidth = params.canvasWidth;
    shareBg.imageHeight = params.canvasHeight;
    // 创建基本画布
    this.createCanvasContext('superPoster');
    // 绘制图片
    this.canvasImage(shareBg);
    // 二维码
    const code = await wepy.downloadFile({url: params.member.inviteCode});
    code.x = params.canvasWidth * 0.38;
    code.y = params.canvasHeight * 0.60;
    code.imageWidth = params.canvasWidth * 0.23;
    code.imageHeight = params.canvasWidth * 0.23;
    code.padding = 0;
    this.canvasImage(code);
    this.context.draw();
  }
}
