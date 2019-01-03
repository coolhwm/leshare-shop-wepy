import base from './base';

export default class point extends base {
  /**
   *  获取门店规则
   */
  static getShopPointRule (subShopId) {
    const url = `${this.baseUrl}/member_point/rules/${subShopId}`;
    return this.get(url).then(data => this.processPointRule(data));
  }
  static processPointRule(rule) {
    if (rule == null) {
      return;
    }

    const priceLimits = [];
    const { limitType, limitValue, availableAmount, percent } = rule;
    priceLimits.push(`抵${percent > 0 ? percent : 100}%`);
    if (limitType == 'NONE') {
      priceLimits.push('无金额限制');
    } else if (limitType == 'RULE_PER_MAX') {
      priceLimits.push(`单笔可用￥${availableAmount}`);
    } else if (limitType == 'RULE_DAY_MAX') {
      priceLimits.push(`日限￥${limitValue},可用￥${availableAmount}`);
    } else if (limitType == 'MEMBER_DAY_MAX') {
      priceLimits.push(`日限￥${limitValue},可用￥${availableAmount}`);
    } else if (limitType == 'MEMBER_MONTH_MAX') {
      priceLimits.push(`月限￥${limitValue},可用￥${availableAmount}`);
    } else if (limitType == 'LOCK') {
      priceLimits.push(`已冻结￥${limitValue}`);
    }
    rule.priceTips = priceLimits.join(',');

    const timeLimits = [];
    // 规则尚未生效
    const { beginTime, endTime, date, week, time } = rule;
    if (beginTime) {
      timeLimits.push(`${beginTime.substring(0, 11)}开始`);
    }
    if (endTime) {
      timeLimits.push(`${endTime.substring(0, 11)}截止`);
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
    if (timeLimits.length > 0) {
      rule.timeTips = '限' + timeLimits.join(',') + '使用';
    }
    return rule;
  }
}
