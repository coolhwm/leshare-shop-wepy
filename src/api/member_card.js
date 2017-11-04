import base from './base';

export default class Vip extends base {
  /**
   * 获取会员卡信息
   */
  static async info() {
    const url = `${this.baseUrl}/memberCards`;
    return await this.get(url);
  }
}
