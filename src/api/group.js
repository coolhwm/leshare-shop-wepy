import base from '../api/base';
import order from '../api/order';
import Lang from '../utils/Lang'
import goods from '../api/goods';

export default class group extends base {

  /***
   * 开团/参团
   */
  static goodsGroup (trade, address) {
    const url = `${this.baseUrl}/goods_group`;
    order._processOrderAddress(trade, address);
    const param = {
      ruleId: trade.ruleId,
      order: trade,
      id: trade.groupId
    };
    return this.post(url, param);
  }

  /***
   * 虚拟商品开团/参团
   */
  static digitGroup (trade) {
    const url = `${this.baseUrl}/goods_group`;
    const param = {
      ruleId: trade.ruleId,
      order: trade,
      id: trade.groupId
    };
    return this.post(url, param);
  }

  /**
   * 处理商品详情
   */
  static _processGoodsDetail (detail) {
    // 解析预览图
    goods._processGoodsPreview(detail.goods);

    // 解析SKU规格
    goods._processSkuLable(detail.goods);

    // 处理价格范围区间
    goods._processGoodsPriceRange(detail.goods);

    // 处理价格标签
    goods._processGoodsPriceLabel(detail.goods);
    detail.sellPrice = Lang._fixedPrice(detail.sellPrice);
    // 页面显示的原价
    detail.goods.originSellPrice = detail.goods.sellPrice;
    detail.goods.sellPrice = Lang._fixedPrice(detail.goods.sellPrice);
    // 处理活动时间状态
    this._processTimeStatus(detail);

    return detail;
  }

  /***
   * 处理活动时间状态
   */
  static _processTimeStatus(detail) {
    detail.isTimeOut = new Date(detail.endTime).getTime() < new Date().getTime();
    const beginTime = detail.startTime || detail.beginTime;
    detail.isBegin = new Date(beginTime).getTime() > new Date().getTime();
  }
}
