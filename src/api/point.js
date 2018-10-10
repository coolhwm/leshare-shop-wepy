import base from './base';

export default class point extends base {
  /**
   *  获取门店规则
   */
  static getShopPointRule (subShopId) {
    console.info(subShopId);
    const url = `${this.baseUrl}/member_point/rules/${subShopId}`;
    return this.get(url).then(data => this.processPointRule(data));
  }
  static processPointRule(rule) {
    console.info(rule);
    const priceLimits = [];
    // 数值预处理
    rule.isPerMax = rule.perMax > 0;
    rule.perMax = rule.perMax || Number.MAX_SAFE_INTEGER;

    rule.isDayMax = rule.dayMax > 0;
    rule.dayMax = rule.dayMax || Number.MAX_SAFE_INTEGER;
    const { percent, isPerMax, perMax, isDayMax, dayMax, dayUsed } = rule;
    // 规则已生效
    const dayUseable = Math.max((dayMax - dayUsed), 0);
    priceLimits.push(`可抵${percent > 0 ? percent : 100}%`);
    if (isPerMax && perMax < dayUseable) {
      priceLimits.push(`单笔限抵￥${perMax}`);
    } else if (isDayMax) {
      priceLimits.push(`今日还可抵￥${dayUseable}`);
    } else {
      priceLimits.push(`无金额限制`);
    }
    rule.priceTips = priceLimits.join(',');
    rule.dayUseable = dayUseable;

    if (!rule.available) {
      const timeLimits = [];
      // 规则尚未生效
      const { beginTime, date, week, time } = rule;
      if (beginTime) {
        timeLimits.push(`${beginTime}开始`);
      }
      if (date) {
        timeLimits.push(`每月${date}日`);
      }
      if (week) {
        timeLimits.push(`每周${week}`);
      }
      if (time) {
        timeLimits.push(`每日${time}`);
      }
      rule.timeTips = '仅限' + timeLimits.join(',') + '使用';
    }
    console.info(rule);
    return rule;
  }
}
