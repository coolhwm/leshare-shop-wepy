import base from './base';
import Page from '../utils/Page';

export default class booking extends base {
  /***
   * 获取充值规则
   */
  static getTopUp () {
    const url = `${this.baseUrl}/members/balance/rules`;
    return this.get(url);
  }

  /***
   * 充值下单
   */
  static topUp (param) {
    const url = `${this.baseUrl}/orders/topUp`;
    return this.post(url, param)
  }

  /***
   * 查询账单记录
   */
  static checkRecord () {
    const url = `${this.baseUrl}/members/balance_detail?sort=desc`;
    return new Page(url, this._processRecord.bind(this));
  }

  /** ********************* 数据处理方法 ***********************/
  static _processRecord(data) {
    if (data.costMoney) {
      data.costMoney = data.costMoney.toFixed(2);
    }
  }
}
