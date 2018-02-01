import base from './base';
import Page from '../utils/Page';

export default class member extends base {
  /**
   * 获取会员整合信息
   */
  static info() {
    return Promise.all([this._member(), this._card()]).then(([member, card]) => {
      const discount = this.processDiscount(card, member);
      return {
        member, card, discount
      }
    });
  }
  /**
   * 注册会员卡信息
   */
  static async regist(param, code) {
    const url = `${this.baseUrl}/members?sms_code=${code}`;
    return this.post(url, param);
  }
  /**
   * 手机验证码
   */
  static async code(phone) {
    const url = `${this.baseUrl}/members/sms_code?phone=${phone}`;
    return this.get(url);
  }
  /**
   * 历史积分信息
   */
  static async bonus() {
    const url = `${this.baseUrl}/members/bonus_detail?by=create_time&sort=desc`;
    return new Page(url, this.processBonusTransformation.bind(this));
  }
  /**
   * 获取会员卡信息
   */
  static _card() {
    const url = `${this.baseUrl}/memberCards`;
    return this.get(url);
  }
  /**
   * 获取会员信息
   */
  static _member() {
    const url = `${this.baseUrl}/members`;
    return this.get(url);
  }
  /**
   * 处理折扣率
   */
  static processDiscount(card, member) {
    if (member == null || card == null) {
      return null;
    }
    if (card.supplyDiscount != 1) {
      return null;
    }
    // 计算折扣
    const {discountRule, customDiscount} = member;
    if (discountRule == null) {
      return null;
    }
    let discount = 100;
    if (customDiscount > 0 && customDiscount <= 100) {
      // 自定义折扣
      discount = customDiscount;
    } else if (discountRule != null && discountRule.discount < 100) {
      // 等级折扣
      discount = discountRule.discount;
    }
    // 判断异常情况
    if (discount == null || discount >= 100 || discount <= 0) {
      return null;
    }
    const {discountCategoryLists} = discountRule;
    if (discountCategoryLists == null || discountCategoryLists.length < 1) {
      return null;
    }
    const categories = discountRule.discountCategoryLists.map(item => item.categoryId);
    return {
      level: discountRule.levelName,
      categories,
      rate: discount
    };
  }
  /**
   * 处理积分明细
   */
  static processBonusTransformation (bonusInfo) {
    const comment = {};
    if (bonusInfo.addBonus > 0) {
      comment.costMoney = `消费金额：￥${bonusInfo.costMoney.toFixed(2)}`;
    } else {
      comment.costMoney = `抵扣金额：￥${bonusInfo.costMoney.toFixed(2)}`;
    }
    comment.addBonus = bonusInfo.addBonus;
    comment.createTime = bonusInfo.createTime;
    comment.orderId = bonusInfo.orderId;
    comment.typeDesc = bonusInfo.typeDesc;
    return comment;
  }
}
