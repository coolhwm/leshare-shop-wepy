import base from './base';
import Page from '../utils/Page';

export default class member extends base {
    /**
     * 获取会员卡信息
     */
  static async info() {
    const url = `${this.baseUrl}/members`;
    return await this.get(url);
  }

  /**
   * 注册会员卡信息
   */
  static async create(param) {
    const url = `${this.baseUrl}/members`;
    return this.post(url, param);
  }
    /**
     * 历史积分信息
     */
  static async bonusPage() {
    const url = `${this.baseUrl}/members/bonus_detail`;
    return new Page(url);
  }
}
