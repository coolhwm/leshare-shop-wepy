import base from './base';
import Page from '../utils/Page';
import {TYPE, ACTION, orderUtils as utils} from './order_const';
import WxUtils from '../utils/WxUtils';

/**
 * 订单服务类
 */
export default class order extends base {
  /**
   * 返回分页对象
   */
  static page () {
    const url = `${this.baseUrl}/orders`;
    return new Page(url, this._processOrderListItem.bind(this));
  }

  /**
   * 获取订单统计信息
   */
  static count () {
    const url = `${this.baseUrl}/orders/count`;
    return this.get(url).then(data => {
      const result = {};
      data.forEach(({status, total}) => {
        result[status] = total;
      });
      return result;
    });
  }

  /**
   * 获取订单详情
   */
  static getInfo (orderId) {
    const url = `${this.baseUrl}/orders/${orderId}`;
    return this.get(url, {}).then(detail => this._processOrderDetail(detail));
  }

  /**
   * 生成预支付订单
   */
  static prepayOrder (orderId) {
    const url = `${this.baseUrl}/wxpay/orders/${orderId}`;
    return this.get(url, {});
  }

  /**
   * 拉起微信支付
   */
  static wxpayOrder (payment) {
    return WxUtils.wxPay({
      'timeStamp': payment.timeStamp,
      'nonceStr': payment.nonceStr,
      'package': payment.packageValue,
      'signType': 'MD5',
      'paySign': payment.paySign
    });
  }

  /**
   * 创建订单
   */
  static createOrder (trade, address) {
    const url = `${this.baseUrl}/orders`;
    this._processOrderAddress(trade, address);
    return this.post(url, trade);
  }

  /**
   * 申请退款
   */
  static refundOrder (orderId, refund) {
    const url = `${this.baseUrl}/orders/${orderId}/status/refund`;
    return this.put(url, refund);
  }

  /**
   *  取消退款
   */
  static cancelRefundOrder (orderId, refundUuid) {
    const url = `${this.baseUrl}/orders/${orderId}/status/cancel_refund_money`;
    const param = {
      refundUuid: refundUuid
    };
    return this.put(url, param);
  }

  /**
   * 关闭订单
   */
  static closeOrder (orderId) {
    const url = `${this.baseUrl}/orders/${orderId}/status/close`;
    return this.put(url, '买家关闭');
  }

  /**
   * 确认收货
   */
  static confirmOrder (orderId) {
    const url = `${this.baseUrl}/orders/${orderId}/status/comments`;
    return this.put(url);
  }

  /***
   * 创建线下订单
   */
  static offline(param) {
    const url = `${this.baseUrl}/orders/offline`;
    return this.post(url, param);
  }

  /** ********************* 生成方法 ***********************/

  /**
   * 购物车下单
   */
  static createCartTrade (goodsList, param) {
    const orderGoodsInfos = [];
    let price = 0;
    // 根据购物车信息，构造订单的商品列表
    for (let i in goodsList) {
      const goods = goodsList[i];
      const info = {
        goodsId: goods.goodsId,
        goodsName: goods.goodsName,
        imageUrl: goods.goodsImage,
        goodsPrice: goods.goodsPrice,
        count: goods.goodsNum,
        innerCid: goods.innerCid,
        skuText: goods.skuText,
        goodsSku: goods.goodsSku,
        goodsSellPrice: goods.originalPrice,
        discount: goods.discount,
        discountRate: goods.discountRate,
        discountText: goods.discountText
      };
      orderGoodsInfos.push(info);
      price += goods.goodsPrice * goods.goodsNum;
    }
    let finalPrice = price;
    let reduceFee = 0;
    // 满减处理
    if (param && param.reduce) {
      reduceFee = param.reduce.fee;
      finalPrice -= reduceFee;
      if (finalPrice < 0) {
        finalPrice = 0;
      }
    }
    finalPrice = finalPrice.toFixed(2);
    // 构造交易对象
    const type = param.orderType;
    const trade = {
      orderType: type,
      dealPrice: price.toFixed(2),
      reduceFee: reduceFee,
      finalPrice: finalPrice,
      postFee: (0).toFixed(2),
      paymentType: '1',
      paymentText: '在线支付',
      orderGoodsInfos: orderGoodsInfos,
      shopName: this.shopName
    };
    // 初始化订单类型标志位
    this._processTypeFlag(trade);
    // 堂食打包初始化出餐时间
    if (trade.isInShopOrder) {
      trade.arriveTime = '立即出餐';
    }
    return trade;
  }

  /**
   * 根据订单构造退款对象
   */
  static createOrderRefund (order) {
    return {
      orderId: order.orderId,
      uuid: order.uuid,
      type: 0,
      contactName: order.receiveName,
      contactPhone: order.receivePhone,
      price: order.finalPrice
    };
  }

  /**
   * 根据退款时间生成退款步骤
   */

  static createOrderRefundSetps (refund) {
    let steps = [];

    // 提交申请
    const creareTime = refund.createTime;
    if (creareTime) {
      steps.push(this._createRefundSetp('您的取消申请已提交，请耐心等待', creareTime));
      steps.push(this._createRefundSetp('等待卖家处理中,卖家24小时未处理将自动退款', creareTime));
    }

    // 卖家处理
    const sellerTime = refund.sellerDealtime;
    if (sellerTime) {
      // 卖家同意
      if (refund.isAgree == 1) {
        steps.push(this._createRefundSetp('卖家已同意退款', sellerTime));
        steps.push(this._createRefundSetp('款项已原路退回中，请注意查收', sellerTime));
      } else {
        // 卖家不同意
        steps.push(this._createRefundSetp(`卖家不同意退款，原因：${refund.disagreeCause}`, sellerTime));
      }
    }

    // 处理结束
    const finishTime = refund.finishTime;
    if (finishTime) {
      // 卖家同意
      if (refund.isAgree == 1) {
        steps.push(this._createRefundSetp('退款成功', finishTime));
      } else {
        // 卖家不同意
        steps.push(this._createRefundSetp('退款关闭，请联系卖家处理', finishTime));
      }
    }

    // 买家关闭
    const closeTime = refund.closeTime;
    if (closeTime) {
      // 卖家同意
      if (refund.isAgree == 2) {
        steps.push(this._createRefundSetp('退款关闭，请联系卖家处理', finishTime));
      } else if (refund.isAgree == 1) {
        // 不需要
      } else {
        steps.push(this._createRefundSetp('买家取消退款，交易恢复', closeTime));
      }
    }

    // 改变最后一个状态
    const lastStep = steps[steps.length - 1];
    lastStep.done = true;
    lastStep.current = true;

    // 反转
    steps = steps.reverse();
    return steps;
  }

  static _createRefundSetp (text, time) {
    return {
      text: text,
      timestape: time,
      done: false,
      current: false
    };
  }

  /** ********************* 数据处理方法 ***********************/

  /**
   * 处理订单动作
   */
  static _processOrderAction(order, inner = false) {
    const basic = [];
    // 有退款的情况
    if (order.curRefund) {
      basic.push(ACTION.REFUND_DETAIL);
    }
    const {orderType, paymentType, status} = order;
    const actions = utils.statusActions(orderType, paymentType, status);
    if (actions) {
      const display = inner ? actions.filter(v => v.inner != true) : actions;
      order.actions = basic.concat(display);
    } else {
      order.actions = basic;
    }
  }

  /**
   * 处理订单地址
   */
  static _processOrderAddress (order, address) {
    if (utils.isDeliveryOrder(order.orderType)) {
      order.receiveName = `${address.name} ${address.sexText}`;
      order.receivePhone = address.phone;
      order.address = address.fullAddress;
    }
  }

  /**
   * 处理订单列表数据
   */
  static _processOrderListItem (order) {
    order.shopName = this.shopName;
    // 处理订单状态
    this._processOrderStatusDesc(order);
    // 处理订单价格
    this._processOrderPrice(order);
    // 处理订单动作
    this._processOrderAction(order, true);
    // 处理商品信息
    const goods = order.orderGoodsInfos;
    this._processOrderGoods(goods);
    // 处理离线支付
    this._processOfflinePayment(order);
  }
  /**
   * 处理订单详情
   */
  static _processOrderDetail (detail) {
    // 支付方式
    detail.shopName = this.shopName;
    // 处理订单支付方式
    this._processOrderPaymentText(detail);
    // 处理订单状态
    this._processOrderStatusDesc(detail);
    // 处理退款信息
    this._processOrderRefund(detail);
    // 处理物流信息
    this._processOrderTrace(detail);
    // 处理订单配送方式
    this._processOrderDetailDelivery(detail);
    // 处理订单价格
    this._processOrderPrice(detail);
    // 处理订单动作
    this._processOrderAction(detail);
    // 处理商品信息
    this._processOrderGoods(detail.orderGoodsInfos);
    // 处理标志位信息
    this._processTypeFlag(detail);
    // 处理离线支付
    this._processOfflinePayment(detail);
    return detail;
  }

  static _processOfflinePayment(order) {
    const orderType = order.orderType;
    if (orderType != TYPE.OFFLINE) return;
    order.orderGoodsInfos = [{
      imageUrl: 'http://img.leshare.shop/shop/other/wechat_pay.png',
      goodsName: `微信支付 ${order.finalPrice}元`,
      goodsPrice: order.finalPrice,
      count: 1
    }];
    return order;
  }

  /**
   * 处理标志位信息
   */
  static _processTypeFlag(order) {
    const type = order.orderType;
    order.isFoodOrder = utils.isFoodOrder(type);
    order.isDeliveryOrder = utils.isDeliveryOrder(type);
    order.isInShopOrder = utils.isInShopOrder(type);
    order.isMallOrder = utils.isMallOrder(type);
    return order;
  }

  /**
   * 处理订单支付方式
   */
  static _processOrderPaymentText (detail) {
    detail.paymentText = utils.paymentType(detail.paymentType);
  }

  /**
   * 处理订单状态
   */
  static _processOrderPrice (order) {
    order.postFee = this._fixedPrice(order.postFee);
    order.dealPrice = this._fixedPrice(order.dealPrice);
    order.finalPrice = this._fixedPrice(order.finalPrice);
    order.couponPrice = this._fixedPrice(order.couponPrice);
    order.reduceFee = this._fixedPrice(order.reduceFee);
    order.bonusPrice = this._fixedPrice(order.bonusPrice);
  }

  static _fixedPrice (price) {
    if (price == null || isNaN(Number(price))) {
      return null;
    }
    return price.toFixed(2);
  }

  /**
   * 处理状态描述文本
   */
  static _processOrderStatusDesc (order) {
    const {status, orderType} = order;
    order.statusText = utils.statusName(orderType, status);
    order.statusDesc = utils.statusDesc(order, status);
    // 订单关闭增加关闭原因
    if (order.status == 7 && order.orderCloseNote) {
      const reason = order.orderCloseNote;
      order.statusDesc = `订单已关闭，关闭原因：${reason.note}`;
    }
  }
  /**
   * 处理物流配送信息
   */
  static _processOrderDetailDelivery (order) {
    order.deliveryText = utils.deliveryType(order.deliveryType);
  }

  /**
   * 处理商品物流信息
   */
  static _processOrderTrace (order) {
    const express = order.orderExpress;
    if (express == null) {
      // 没有物流信息，不做处理
      return;
    }
    // 有物流，就一定需要展现动作列表
    order.isExpress = true;
  }

  /**
   * 处理订单的退货信息
   */
  static _processOrderRefund (order) {
    const refunds = order.orderRefunds;
    if (refunds == null || refunds.length < 1) {
      // 订单没有退款信息，不做处理
      return;
    }
    // 取出第一条退款记录
    order.curRefund = refunds[refunds.length - 1];
  }

  /**
   * 处理订单商品信息
   */
  static _processOrderGoods (goods) {
    if (goods == null || goods.length < 1) return;
    goods.forEach(item => {
      item.imageUrl += '/small';
    });
    if (goods == null || goods.length < 1) {
      return;
    }
    goods.forEach(item => {
      // 处理SKU描述
      const sku = item.goodsSku;
      item.skuText = this._processOrderSku(sku);
    });
  }

  /**
   * 处理SKU的默认值
   */

  static _processOrderSku (goodsSku) {
    let skuText = '';
    if (goodsSku && goodsSku != '') {
      skuText = goodsSku.replace(/:/g, ',');
    }
    return skuText;
  }
}
