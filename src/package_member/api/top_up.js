import base from '../../api/base';
import Page from '../../utils/Page';
import Lang from '../../utils/Lang';

export default class booking extends base {
  /***
   * 获取充值规则
   */
  static getTopUp () {
    const url = `${this.baseUrl}/members/balance/rules`;
    return this.get(url).then(data => {
      if (!data) {
        return [];
      }
      data.forEach(rule => {
        const { giftPoint, giftFee, giftCoupon, coupons } = rule;
        const point = giftPoint || 0;
        const fee = giftFee || 0;
        const totalGiftFee = point + fee;
        const couponNum = giftCoupon && coupons ? coupons.length : 0;
        rule.couponNum = couponNum;
        rule.isVip = rule.memberLevel > 0 || rule.suitFirst;
        const tips = [];
        if (totalGiftFee > 0) {
          tips.push(`${totalGiftFee}元`);
        }
        if (couponNum > 0) {
          tips.push(`${couponNum}张券`);
        }
        if (tips.length > 0) {
          rule.tips = '赠' + tips.join('+');
        }
        rule.priority = rule.baseFee;
        if (rule.isVip) {
          rule.priority -= 100000;
        }
        data.sort((a, b) => a.priority - b.priority);
      });
      return data;
    });
  }

  /***
   * 充值下单
   */
  static topUp (param) {
    const url = `${this.baseUrl}/orders/topUp`;
    return this.post(url, param)
  }

  /***
   * 查询余额账户账单记录
   */
  static listBalanceDetails () {
    const url = `${this.baseUrl}/members/balance_detail?sort=desc`;
    return new Page(url, this._processRecord.bind(this));
  }

  /***
   * 查询优惠账户账单记录
   */
  static listPointDetails () {
    const url = `${this.baseUrl}/member_point/detail_list?sort=desc`;
    return new Page(url, this._processRecord.bind(this));
  }

  /** ********************* 数据处理方法 ***********************/
  static _processRecord(data) {
    data.costMoney = Lang._fixedPrice(data.costMoney);
  }
}
