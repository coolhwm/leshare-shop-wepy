export default class Route {
  /**
   * 如果上一个页面符合条件，则navigaetBack，否则调用redirectTo
   */
  static backIfExists(url) {
    const pages = getCurrentPages();
    if (pages.length < 2 || '/' + pages[pages.length - 2].route != url) {
      wx.redirectTo({
        url: url
      });
    } else {
      wx.navigateBack()
    }
  }
}
