import base from './base';

export default class goods extends base {
  /**
   * 申请
   */
  static apply (param) {
    const url = `${this.baseUrl}/agent/apply`;
    return this.post(url, param);
  }

  /***
   * 查询
   */
  static agent (customerId) {
    const url = `${this.baseUrl}/agent/agent/${customerId}`;
    return this.get(url);
  }

  /** ********************* 数据处理方法 ***********************/
}
