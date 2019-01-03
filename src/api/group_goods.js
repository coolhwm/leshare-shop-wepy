import base from '../api/base';

export default class group extends base {
  /***
   * 组合购下单
   */
  static order(trade, ruleId) {
    const url = `${this.baseUrl}/orders/group_goods/${ruleId}`;
    return this.post(url, trade)
  }
}
