import base from '../../api/base';
import Page from '../../utils/Page'

export default class member extends base {

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
   * 获取会员信息
   */
  static _member() {
    const url = `${this.baseUrl}/members`;
    return this.get(url);
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
