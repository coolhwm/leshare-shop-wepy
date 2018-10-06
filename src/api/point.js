import base from './base';

export default class point extends base {
  /**
   *  获取门店规则
   */
  static getShopPointRule (subShopId) {
    const url = `${this.baseUrl}/member_point/rules/${subShopId}`;
    return this.get(url);
  }
}
