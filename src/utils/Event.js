const WxNotificationCenter = require('./WxNotificationCenter.js');

export default class Event {
  // 签到更新事件
  static SIGN_UPDATE = 'SIGN_UPDATE';
  // 预约列表更新事件
  static BOOKING_LIST_UPDATE = 'BOOKING_LIST_UPDATE';
  // 砍价详情更新事件
  static BARGAIN_DETAIL_UPDATE = 'BARGAIN_DETAIL_UPDATE';
  // 砍价列表更新事件
  static BARGAIN_LIST_UPDATE = 'BARGAIN_LIST_UPDATE';
  // 拼团列表更新事件
  static GROUP_LIST_UPDATE = 'GROUP_LIST_UPDATE';
  // 订单列表更新事件
  static ORDER_LIST_UPDATE = 'ORDER_LIST_UPDATE';
  // 订单列表状态更新
  static ORDER_TAB_UPDATE = 'ORDER_TAB_UPDATE';
  // 商品详情更新事件
  static GOODS_DETAILS_UPDATE = 'GOODS_DETAILS_UPDATE';
  // 重置商品列表
  static GOODS_CATEGORY_RELOAD = 'GOODS_CATEGORY_RELOAD';
  // 商品列表更新事件
  static GOODS_LIST_UPDATE = 'GOODS_LIST_UPDATE';
  // 卡券列表更新事件
  static COUPON_LIST_UPDATE = 'COUPON_LIST_UPDATE';
  // 订单中的卡券信息更新
  static TRADE_COUPON_UPDATE = 'TRADE_COUPON_UPDATE';
  // 订单中的地址信息更新
  static TRADE_ADDRESS_UPDATE = 'TRADE_ADDRESS_UPDATE';
  // 公告列表更新事件
  static NOTICE_LIST_UPDATE = 'NOTICE_LIST_UPDATE';
  // 配送列表更新事件
  static DELIVERY_LIST_UPDATE = 'DELIVERY_LIST_UPDATE';
  // 店铺信息更新
  static SHOP_INFO_UPDATE = 'SHOP_INFO_UPDATE';
  // 购物车清空
  static CART_LIST_CLEAR = 'CART_LIST_CLEAR';
  // 购物车重置
  static CART_LIST_RESET = 'CART_LIST_RESET';
  // 购物车增加
  static CART_LIST_ADD = 'CART_LIST_ADD';
  // 地址详情更新
  static ADDRESS_DETAIL_UPDATE = 'ADDRESS_DETAIL_UPDATE';
  // 地址列表更新
  static ADDRESS_LIST_UPDATE = 'ADDRESS_LIST_UPDATE';
  // 注册会员卡
  static REGISTE_MEMBER_UPDATE = 'REGISTE_MEMBER_UPDATE';
  // 会员卡信息更新
  static MEMBER_CARD_UPDATE = 'MEMBER_CARD_UPDATE';
  // 打开购物面板
  static GOODS_PANEL_OPEN = 'GOOD_PANEL_OPEN';
  static GOODS_PANEL_PLUS = 'GOODS_PANEL_PLUS';
  static GOODS_PANEL_MINUS = 'GOODS_PANEL_MINUS';
  // 点餐类型
  static FOOD_TYPE_UPDATE = 'FOOD_TYPE_UPDATE';
  // 重启程序
  static RELAUNCH_APP = 'RELAUNCH_APP';
  static listen(eventName, callback, observer) {
    // 先移除监听
    this.remove(eventName, observer);
    WxNotificationCenter.addNotification(eventName, callback, observer);
  }

  static emit(eventName, params) {
    WxNotificationCenter.postNotificationName(eventName, params);
  }

  static remove(eventName, observer) {
    WxNotificationCenter.removeNotification(eventName, observer);
  }
}
