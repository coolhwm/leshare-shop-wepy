import Tips from './Tips';
import wepy from 'wepy';

export default class WxUtils {
  static tabUrls = ['/pages/home/template', '/pages/goods/category', '/pages/goods/cart', '/pages/customer/index_template', '/pages/customer/index_template'];
  static mapUrls = {
    '/pages/shop/index': '/pages/home/template',
    '/pages/home/home': '/pages/home/template'
  };
  static parseQrScene(scene, key) {
    if (scene == null || key == null) return null;
    const paramStr = decodeURIComponent(scene);
    const paramMap = paramStr.split('=');
    if (paramMap == null || paramMap.length != 2) {
      console.warn('[scene]parse scene error：', scene);
      return null;
    }
    if (paramMap[0] != key) {
      console.warn('[scene]can not find scene key', scene);
      return null;
    }
    return paramMap[1];
  }

  static isTab (url) {
    const type = wepy.$instance.globalData.shopType;
    return type == 1 && this.tabUrls.some(path => path == url);
  }
  static mapUrl (url) {
    const type = wepy.$instance.globalData.shopType;
    if (type == 1 && this.mapUrls[url]) {
      return this.mapUrls[url];
    } else {
      return url;
    }
  }

  /**
   * 如果能够后退（多层），则navigaetBack，否则调用redirectTo
   */
  static backOrRedirect(url) {
    url = this.mapUrl(url);
    console.info(url);
    if (this.isTab(url)) {
      console.info('switch');
      wx.switchTab({
        url: url
      })
    } else {
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
  }
  /**
   * 如果能够后退（多层），则navigaetBack，否则调用navigateTo
   */
  static backOrNavigate(url) {
    url = this.mapUrl(url);
    if (this.isTab(url)) {
      wx.switchTab({
        url: url
      })
    } else {
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
}
