import base from './base';
import api from './group';
import Page from '../utils/Page';

export default class group extends base {
  /***
   * 根据拼团商品规则ID查找拼团信息(商品)
   */
  static rule (ruleId) {
    const url = `${this.baseUrl}/goods_bargain/rules/${ruleId}`;
    return this.get(url).then(data => api._processGoodsDetail(data));
  }

  /***
   * 开砍/帮砍
   */
  static GoodsBargain (ruleId, id) {
    const url = `${this.baseUrl}/goods_bargain`;
    const param = {
      ruleId: ruleId,
      id: id
    };
    return this.post(url, param)
  }
  /***
   * 根据砍价ID查找砍价详情
   */
  static bargain (bargainId) {
    const url = `${this.baseUrl}/goods_bargain/${bargainId}`;
    return this.get(url).then(data => this._processBargainGoods(data));
  }

  // 处理方法
  static _processBargainGoods (data) {
    api._processGoodsPreview(data.rule)
    return data;
  }
}
