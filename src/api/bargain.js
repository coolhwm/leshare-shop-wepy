import base from './base';
import api from './group';
import Page from '../utils/Page';
import wepy from 'wepy';

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
  static GoodsBargain (ruleId, id, sku) {
    const url = `${this.baseUrl}/goods_bargain`;
    const param = {
      ruleId: ruleId,
      id: id,
      sku: sku
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

    // 处理预览图
    api._processGoodsPreview(data.rule);

    // 筛选规格
    this._processSkuDetail(data);

    // 筛选开砍者
    this._processBargainHeader(data);

    // 求一共砍了多少钱
    this._processAllBargainPrice(data);

    // 求还剩多少钱
    this._processBalance(data);
    return data;
  }

  // 筛选开砍规格
  static _processSkuDetail (data) {
    data.rule.skuDetail = data.rule.skuDetails.find(item => item.sku === data.sku)
  }

  // 筛选开砍者
  static _processBargainHeader (data) {
    // const user = wepy.getStorageSync('user');
    data.header = data.details[0];
    // data.isHead = user.id === data.header.customer.id;
    data.isHead = false;
  }

  // 求一共砍了多少钱
  static _processAllBargainPrice (data) {
    const prices = data.details.map(item => item.reducePrice);
    data.allPrice = 0;
    let max = 0;
    for (let idx in prices) {
      data.allPrice += prices[idx];
      if (prices[idx] > max) {
        max = prices[idx];
      }
    }
  }

  // 求还剩多少钱
  static _processBalance (data) {
    if (data.allPrice) {
      data.balance = (data.rule.skuDetail.price * 1 - data.allPrice * 1).toFixed(2);
    } else {
      data.balance = data.rule.skuDetail.price * 1;
    }
  }
}
