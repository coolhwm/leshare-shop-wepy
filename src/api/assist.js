import base from './base';
import wepy from 'wepy';
import Page from '../utils/Page';
import goods from './goods';
import Lang from '../utils/Lang';

export default class assist extends base {
  /**
   * 获取助力规则
   */
  static rule(ruleId) {
    const url = `${this.baseUrl}/assist_activity/rules/${ruleId}`;
    return this.get(url).then(data => this._processAssistRule(data));
  }
  /**
   * 助力
   */
  static assistActivity(data) {
    const url = `${this.baseUrl}/assist_activity`;
    return this.post(url, data);
  }
  /**
   * 我的助力
   */
  static list(status) {
    const url = `${this.baseUrl}/assist_activity/list?status=${status}`;
    return new Page(url, item => {
      this._processAssistList(item)
    });
  }
  /**
   * 根据ID查询助力详细内容
   */
  static assistInfo(assistId) {
    const url = `${this.baseUrl}/assist_activity/${assistId}`;
    return this.get(url).then(data => this._processAssistInfo(data));
  }
 // 处理事件

  /**
   * 处理主力规则
   */
  static _processAssistRule(data) {
    // 解析预览图
    goods._processGoodsPreview(data.goods);
    data.endTime = data.dueTime;
    data.isTimeOut = new Date(data.endTime).getTime() < new Date().getTime();
    data.isBegin = new Date(data.startTime).getTime() > new Date().getTime();
    data.remainder = data.limitCount * 1 - data.successCount * 1;
    if (data.remainder < 0) data.remainder = 0
    return data
  }

  /**
   * 处理助力详情
   */
  static _processAssistInfo(data) {
    data.helpCount = data.details.length;
    data.joinRate = data.helpCount / data.leastAssist;
    data.remainder = data.limitCount * 1 - data.successCount * 1;
    if (data.remainder < 0) data.remainder = 0
    data.originalPrice = Lang._fixedPrice(data.originalPrice);
    data.isTimeOut = new Date(data.dueTime).getTime() < new Date().getTime()
    const { id: userId } = wepy.$instance.globalData.auth['user'];
    // 是否未发起者
    data.isHead = userId === data.customerId;
    const self = data.details.find(item => item.customerId === userId);
    // 是否已经砍价
    data.isHelp = self != null;
    // 处理助力者
    for (let i = 0; i < data.leftJoin; i++) {
      data.details.push({})
    }
    if (data.dueTime.slice(11, 19) === '00:00:00') {
      data.dueTime = data.dueTime.slice(0, 10)
    }
    return data
  }

  /***
   * 处理我的助力
   */
  static _processAssistList(item) {
    this._processAction(item)
    return item
  }
  // 处理我的砍价动作
  static _processAction (data) {
    const BARGAIN_ACTION_NAME = {
      PROCESSING: '找人助力',
      TIMEOUT: '查看详情',
      SUCCESS: '查看详情'
    };
    const BARGAIN_ACTION_FUNCNAME = {
      PROCESSING: 'help',
      TIMEOUT: 'ruleDetail',
      SUCCESS: 'ruleDetail'
    };
    const action = {};
    action.name = BARGAIN_ACTION_NAME[data.status];
    action.funcName = BARGAIN_ACTION_FUNCNAME[data.status];
    data.action = action
  }
}
