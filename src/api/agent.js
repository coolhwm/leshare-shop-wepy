import base from './base';

/**
 * 商品服务类
 */
export default class goods extends base {
  /**
   * 查询商品目录
   */
  static apply (param) {
    const url = `${this.baseUrl}/agent/apply`;
    return this.post(url, param);
  }

  /** ********************* 数据处理方法 ***********************/
}
