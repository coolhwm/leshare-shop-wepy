export const ACTIONS = {
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
  PAYMENT: {
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
export const ACTION_MAP = {
  // 外卖（线下）
  '20-0-2': [ACTIONS.CLOSE],
  '20-0-4': [ACTIONS.COMMENT],
  // 外卖（线上）
  '20-1-1': [ACTIONS.CLOSE, ACTIONS.PAYMENT],
  '20-1-2': [ACTIONS.REFUND],
  '20-1-4': [ACTIONS.COMMENT],
  '20-1-5': [ACTIONS.UNREFUND],
  // 堂食（线上）
  '30-1-1': [ACTIONS.CLOSE, ACTIONS.PAYMENT],
  '30-1-2': [ACTIONS.REFUND],
  '30-1-4': [ACTIONS.COMMENT],
  '30-1-5': [ACTIONS.UNREFUND],
  // 外带（线上）
  '33-1-1': [ACTIONS.CLOSE, ACTIONS.PAYMENT],
  '33-1-2': [ACTIONS.REFUND],
  '33-1-4': [ACTIONS.COMMENT],
  '33-1-5': [ACTIONS.UNREFUND]
  // 商城（线下）
  // 商城（线上）
};
