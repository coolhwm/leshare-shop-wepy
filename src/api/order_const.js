/**  常量 **/
/**
 * 订单类型
 */
const TYPE = {
  MALL: 10,
  TAKEAWAY: 20,
  FORHERE: 30,
  PACK: 33,
  OFFLINE: 40
};
/**
 * 支付方式
 */
const PAYMENT = {
  OFFLINE: '0',
  ONLINE: '1'
};
/**
 * 订单状态
 */
const STATUS = {
  ALL: 0,
  WAITING: 1,
  PROCESSING: 2,
  SHIPPING: 3,
  COMMENTING: 4,
  REFUNDING: 5,
  SUCCESS: 6,
  CLOSED: 7,
  REFUND_SUCCESS: 8,
  ACCEPTED: 9
};
/**
 * 配送方式
 */
const DELIVERY = {
  SELF: 'SELF',
  CITY: 'CITY',
  EXPRESS: 'EXPRESS'
};

/**  数据字典 **/

/**
 * 订单类型
 */
const ORDER_TYPE_DICT = {
  [TYPE.MALL]: '商城',
  [TYPE.TAKEAWAY]: '外卖',
  [TYPE.FORHERE]: '堂食',
  [TYPE.PACK]: '打包'
};
/**
 * 支付方式
 */
const ORDER_PAYMENT_DICT = {
  [PAYMENT.OFFLINE]: '线下支付',
  [PAYMENT.ONLINE]: '在线支付'
};
/**
 * 配送方式
 */
const ORDER_DELIVERY_DICT = {
  [DELIVERY.SELF]: '上门自提',
  [DELIVERY.CITY]: '同城配送',
  [DELIVERY.EXPRESS]: '快递配送'
};
/**
 * 默认的订单状态描述
 */
const COMMON_STATUS_DICT = {
  [STATUS.ALL]: ['全部', ''],
  [STATUS.WAITING]: ['等待买家付款', '请于24小时内付款，超时订单自动关闭'],
  [STATUS.PROCESSING]: ['等待卖家发货', '您已完成付款，等待卖家发货，超时未发货将自动退款'],
  [STATUS.SHIPPING]: ['卖家已发货', '卖家已发货，请您耐心等待'],
  [STATUS.COMMENTING]: ['等待买家评价', '卖家已收到您的货款，请对本次交易进行评价'],
  [STATUS.REFUNDING]: ['申请退款中', '您已发起退款申请，等待卖家处理'],
  [STATUS.SUCCESS]: ['交易成功', '交易已完成，卖家已收到您的货款'],
  [STATUS.CLOSED]: ['交易关闭', '本交易已取消，欢迎您下次光临'],
  [STATUS.REFUND_SUCCESS]: ['已退款', '钱款已原路退回，请查收'],
  [STATUS.ACCEPTED]: ['已接单', '店家正在备货配送中，请您耐心等待']
};
/**
 * 特殊的订单状态描述
 */
const UNIQUE_STATUS_DICT = {
  [TYPE.MALL]: {},
  [TYPE.TAKEAWAY]: {
    [STATUS.PROCESSING]: ['等待店家接单', '您已完成付款，等待店家确认接单，超时未接单将自动退款'],
    [STATUS.SHIPPING]: ['店家配送中', '店家配送中，请您耐心等待']
  },
  [TYPE.FORHERE]: {
    [STATUS.PROCESSING]: ['等待店家接单', '您已完成付款，等待店家确认接单，超时未接单将自动退款'],
    [STATUS.SHIPPING]: ['店家配餐中', '店家配餐中，请您耐心等待']
  },
  [TYPE.PACK]: {
    [STATUS.PROCESSING]: ['等待店家接单', '您已完成付款，等待店家确认接单，超时未接单将自动退款'],
    [STATUS.SHIPPING]: ['店家配餐中', '店家配餐中，请您耐心等待']
  }
};
/**
 * 按钮的字典
 */
const ACTION = {
  CLOSE: {
    primary: false,
    name: '关闭订单',
    func: 'close'
  },
  RECEIVE: {
    primary: true,
    name: '确认送达',
    func: 'receive'
  },
  COMMENT: {
    primary: true,
    name: '评价订单',
    func: 'comment'
  },
  PAY: {
    primary: true,
    name: '立即支付',
    func: 'pay'
  },
  REFUND: {
    inner: true,
    primary: false,
    name: '申请退款',
    func: 'refund'
  },
  REFUND_DETAIL: {
    inner: true,
    primary: false,
    name: '退款详情',
    func: 'refundDetail'
  },
  UNREFUND: {
    inner: true,
    primary: true,
    name: '撤销退款',
    func: 'unrefund'
  },
  AGAIN: {
    primary: false,
    name: '再来一单',
    func: 'again'
  }
};
/**
 * 状态与按钮的映射关系
 */
const STATUS_ACTIONS = {
  // 外卖（线下）
  '20-0-2': [ACTION.CLOSE],
  '20-0-4': [ACTION.COMMENT],
  // 外卖（线上）
  '20-1-1': [ACTION.CLOSE, ACTION.PAY],
  '20-1-2': [ACTION.REFUND],
  '20-1-4': [ACTION.COMMENT],
  '20-1-5': [ACTION.UNREFUND],
  // 堂食（线上）
  '30-1-1': [ACTION.CLOSE, ACTION.PAY],
  '30-1-2': [ACTION.REFUND],
  '30-1-4': [ACTION.COMMENT],
  '30-1-5': [ACTION.UNREFUND],
  // 外带（线上）
  '33-1-1': [ACTION.CLOSE, ACTION.PAY],
  '33-1-2': [ACTION.REFUND],
  '33-1-4': [ACTION.COMMENT],
  '33-1-5': [ACTION.UNREFUND],
  // 商城（线下）
  '10-0-3': [ACTION.RECEIVE],
  '10-0-4': [ACTION.COMMENT],
  // 商城（线上）
  '10-1-1': [ACTION.CLOSE, ACTION.PAY],
  '10-1-2': [ACTION.REFUND],
  '10-1-3': [ACTION.RECEIVE],
  '10-1-4': [ACTION.COMMENT],
  '10-1-5': [ACTION.UNREFUND],
  // 离线支付
  '40-1-1': [ACTION.CLOSE, ACTION.PAY],
  '40-0-1': [ACTION.CLOSE, ACTION.PAY],
  // 拼团
  '50-1-1': [ACTION.CLOSE, ACTION.PAY],
  '50-1-3': [ACTION.RECEIVE],
  '50-1-4': [ACTION.COMMENT]
};

/**  内部方法 **/
const statusDict = (type, status, index) => {
  const unique = uniqueStatus(type, status, index);
  if (unique != null) {
    return unique;
  } else {
    return commonStatus(status, index);
  }
};
const commonStatus = (status, index) => {
  const statusDict = COMMON_STATUS_DICT[status];
  if (statusDict == null) {
    return;
  }
  return statusDict[index];
};
const uniqueStatus = (type, status, index) => {
  const typeDict = UNIQUE_STATUS_DICT[type];
  if (typeDict == null) {
    return;
  }
  const statusDict = typeDict[status];
  if (statusDict == null) {
    return;
  }
  return statusDict[index];
};

/**  映射方法 **/

/**
 *  映射订单类型
 */
const orderType = value => ORDER_TYPE_DICT[value];

/**
 *  映射支付类型
 */
const paymentType = value => ORDER_PAYMENT_DICT[value];

/**
 *  映射配送类型
 */
const deliveryType = value => ORDER_DELIVERY_DICT[value];

/**
 *  映射订单状态
 */
const statusName = (type, status) => statusDict(type, status, 0);

/**
 *  映射状态描述
 */
const statusDesc = (type, status) => statusDict(type, status, 1);

/**
 * 映射状态动作
 */
const statusActions = (type, payment, status) => {
  const key = `${type}-${payment}-${status}`;
  const actions = STATUS_ACTIONS[key];
  return actions != null ? actions : [];
};

/**  工具方法 **/

/**
 * 是否为商城订单
 */
const isMallOrder = type => type == TYPE.MALL;
/**
 * 是否为餐饮订单
 */
const isFoodOrder = type => type == TYPE.FORHERE || type == TYPE.PACK || type == TYPE.TAKEAWAY;
/**
 * 是否是需要配送的订单
 */
const isDeliveryOrder = type => type == TYPE.TAKEAWAY || type == TYPE.MALL;
/**
 * 是否为堂食订单
 */
const isInShopOrder = type => type == TYPE.FORHERE || type == TYPE.PACK;

/**
 * 导出的方法
 */
const orderUtils = {
  statusActions, orderType, paymentType, deliveryType, statusName, statusDesc, isMallOrder, isFoodOrder, isInShopOrder, isDeliveryOrder
};

export {
  ACTION,
  TYPE,
  PAYMENT,
  DELIVERY,
  STATUS,
  orderUtils
}
