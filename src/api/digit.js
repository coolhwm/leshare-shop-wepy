import base from './base';

export default class digit extends base {
  /**
   * 创建虚拟商品订单
   */
  static order (trade) {
    const url = `${this.baseUrl}/orders/digit`;
    return this.post(url, trade);
  }
}