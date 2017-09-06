import base from './base';

export default class delivery extends base {

  /**
   * 店铺限价
   */
  static limitPrice() {
    const url = `${this.baseUrl}/delivery/limit_price`;
    return this.get(url).then(data => {
      const arr = [];
      if (data.SELF != null) {
        arr.push(data.SELF);
      }
      if (data.CITY != null) {
        arr.push(data.CITY);
      }
      if (data.EXPRESS != null) {
        arr.push(data.EXPRESS);
      }
      let limitPrice = Math.min(...arr);
      if (!limitPrice || Number.isNaN(limitPrice)) {
        limitPrice = 0;
      }
      // app.globalData.shop.limitPrice = limitPrice;
      return limitPrice;
    });
  }
}
