import wepy from 'wepy';
import tips from './Tips';

/**
 * 画布工具类
 */
export default class Canvas {
  context = '';
  static canvasWidth = null;
  static canvasHeight = null;

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
  static setCanvas(canvasColor, canvasWidth, canvasHeight) {
    this.context.setFillStyle(canvasColor);
    this.context.fillRect(0, 0, canvasWidth + 2, canvasHeight);
  }

  /**
   * 画笔文字绘制工具
   * */
  static canvasTextLeft(text, size, color, x, y) {
    this.context.setFillStyle(color);
    this.context.setTextAlign('left');
    this.context.setFontSize(size);
    this.context.fillText(text, x, y);
  }
  static canvasTextCenter(text, size, color, x, y) {
    this.context.setFillStyle(color);
    this.context.setTextAlign('center');
    this.context.setFontSize(size);
    this.context.fillText(text, x, y);
  }
  /**
   *直线工具
   * */
  static fillRect(params) {
    this.context.setFillStyle(params.color);
    this.context.fillRect(params.x, params.y, params.width, params.height)
  }

  /**
   * 图片绘制工具
   * */
  static canvasImage(param) {
    this.context.drawImage(param.tempFilePath, param.x, param.y, param.imageWidth, param.imageHeight);
  }

  /**
   *  开始绘制
   * */
  static draw() {
    this.context.draw();
  }

  /**
   * 保存图片
   * */
  static saveImage(canvasId) {
    // 调用 wx.canvasToTempFilePath方法
    wx.canvasToTempFilePath({
      // 通过id 指定是哪个canvas
      canvasId: canvasId,
      success(res) {
        // 成功之后保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            tips.success('保存成功');
          }
        })
      }
    });
  }
}
