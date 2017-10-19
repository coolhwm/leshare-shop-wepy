import Tips from './Tips';

export default class WxUtils {
  /**
   * 如果能够后退（多层），则navigaetBack，否则调用redirectTo
   */
  static backOrRedirect(url) {
    const pages = getCurrentPages();
    // route在低版本不兼容
    const index = pages.findIndex(item => ('/' + item.__route__) == url);
    if (pages.length < 2 || index < 0) {
      wx.redirectTo({
        url: url
      });
    } else {
      const delta = pages.length - 1 - index;
      wx.navigateBack({
        delta: delta
      });
    }
  }
  /**
   * 如果能够后退（多层），则navigaetBack，否则调用navigateTo
   */
  static backOrNavigate(url) {
    const pages = getCurrentPages();
    // route在低版本不兼容
    const index = pages.findIndex(item => ('/' + item.__route__) == url);
    if (pages.length < 2 || index < 0) {
      wx.navigateTo({
        url: url
      });
    } else {
      const delta = pages.length - 1 - index;
      wx.navigateBack({
        delta: delta
      });
    }
  }

  static wxPay(param) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...param,
        complete: res => {
          if (res.errMsg == 'requestPayment:ok') {
            resolve(res);
          } else {
            reject(res);
          }
        }
      });
    });
  }

  /**
   * 兼容性判断
   */
  static canIUse(str) {
    if (wx.canIUse) {
      return wx.canIUse(str);
    } else {
      return false;
    }
  }
  /**
   * 检查SDK版本
   */
  static isSDKExipred() {
    const {SDKVersion} = wx.getSystemInfoSync();
    console.info(`[version]sdk ${SDKVersion}`);
    return SDKVersion == null || SDKVersion < '1.2.0'
  }
  /**
   * 检查SDK版本
   */
  static checkSDK() {
    if (this.isSDKExipred()) {
      Tips.modal('您的微信版本太低，为确保正常使用，请尽快升级');
    }
  }
}
