export default class Route {
  /**
   * 如果能够后退（多层），则navigaetBack，否则调用redirectTo
   */
  static backIfExists(url) {
    const pages = getCurrentPages();
    const index = pages.findIndex(item => ('/' + item.route) == url);
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
