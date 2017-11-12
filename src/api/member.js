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
    return new Page(url, this.processBonusTransformation.bind(this));
  }
  static processBonusTransformation (bonusInfo) {
    const comment = {};
    if (bonusInfo.addBonus > 0) {
      comment.costMoney = `消费金额：￥ ${bonusInfo.costMoney.toFixed(2)}`;
    } else {
      comment.costMoney = `抵扣金额：￥ ${bonusInfo.costMoney.toFixed(2)}`;
    }
    comment.addBonus = bonusInfo.addBonus;
    comment.createTime = bonusInfo.createTime;
    comment.orderId = bonusInfo.orderId;
    comment.typeDesc = bonusInfo.typeDesc;
    return comment;
  }
}
