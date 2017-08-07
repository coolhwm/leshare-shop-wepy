const WxNotificationCenter = require('./WxNotificationCenter.js');

export default class Event {
  // 订单列表更新事件
  static ORDER_LIST_UPDATE = 'ORDER_LIST_UPDATE';
  // 订单列表状态更新
  static ORDER_TAB_UPDATE = 'ORDER_TAB_UPDATE';
  // 商品详情更新事件
  static GOODS_DETAILS_UPDATE = 'GOODS_DETAILS_UPDATE';
  // 商品列表更新事件
  static GOODS_LIST_UPDATE = 'GOODS_LIST_UPDATE';
  // 卡券列表更新事件
  static COUPON_LIST_UPDATE = 'COUPON_LIST_UPDATE';
  // 公告列表更新事件
  static NOTICE_LIST_UPDATE = 'NOTICE_LIST_UPDATE';
  // 配送列表更新事件
  static DELIVERY_LIST_UPDATE = 'DELIVERY_LIST_UPDATE';
  // 店铺信息更新
  static SHOP_INFO_UPDATE = 'SHOP_INFO_UPDATE';
  static listen(eventName, callback, observer) {
    WxNotificationCenter.addNotification(eventName, callback, observer);
  }

  static emit(eventName, params) {
    WxNotificationCenter.postNotificationName(eventName, params);
  }

  static remove(eventName, observer) {
    WxNotificationCenter.removeNotification(eventName, observer);
  }
}
