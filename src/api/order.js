import base from './base';
import Page from '../utils/Page';
import {ACTIONS, ACTION_MAP} from './order_dict';
import WxUtils from '../utils/WxUtils';

/**
 * 订单服务类
 */
export default class order extends base {
  static PAYMENT_OFFLINE = 0;
  static TYPE_TAKEAWAY = 20;
  static TYPE_FORHERE = 30;
  static TYPE_PACK = 33;
  // 交易状态字典
  static statusDict = {
    '0': '全部',
    '1': '等待买家付款',
    '2': '等待店家接单',
    '3': '店家配送中',
    '4': '等待买家评价',
    '5': '申请退款中',
    '6': '交易成功',
    '7': '交易关闭',
    '8': '卖家已退款',
    '9': '店家已接单'
  };

  // 字符字典
  static paymentDict = {
    '0': '线下支付',
    '1': '在线支付'
  };

  // 订单配送方式
  static deliveryText = {
    'SELF': '上门自提',
    'CITY': '同城配送',
    'EXPRESS': '快递配送'
  };

  static statusDesc = {
    '1': '请于24小时内付款，超时订单自动关闭',
    '2': '您已完成付款，等待店家确认，超时未接单将自动退款',
    '3': '店家已发货，请您耐心等待',
    '4': '卖家已收到您的货款，请对本次交易进行评价',
    '5': '您已发起退款申请，等待卖家处理',
    '6': '交易已完成，卖家已收到您的货款',
    '7': '本交易已取消，欢迎您下次光临',
    '8': '钱款已原路退回，请查收',
    '9': '店家正在备货配送中，请您耐心等待'
  };

  /**
   * 返回分页对象
   */
  static page () {
    const url = `${this.baseUrl}/orders`;
    return new Page(url, this._processOrderListItem.bind(this));
  }

  /**
   * 获取订单详情
   */
  static getInfo (orderId) {
    const url = `${this.baseUrl}/orders/${orderId}`;
    return this.get(url, {}).then(detail => {
      this._processOrderDetail(detail);
      return detail;
    });
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
      'package': payment.package,
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
  static cancelRefund (orderId, refundUuid) {
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

  /**
   * 评价订单
   */
  static comment (orderId, comments) {
    const url = `${this.baseUrl}/comments`;
    return this.post(url, comments);
  }

  /**
   * 评价列表
   */
  static commentList (goodsId) {
    const url = `${this.baseUrl}/comments`;
    return new Page(url, this._processGoodsComment.bind(this));
  }

  /**
   * 评价统计
   */
  static commentCount (goodsId) {
    const url = `${this.baseUrl}/comments/count?goods_id=${goodsId}`;
    return this.get(url);
  }

  /**
   * 处理评价列表数据
   */
  static _processGoodsComment (data) {
    const comment = {};
    comment.createTime = data.createTime.substring(0, 10);
    comment.starArr = [0, 0, 0, 0, 0];
    for (let i = 0; i < data.star; i++) {
      comment.starArr[i] = 1;
    }
    comment.star = data.star;
    if (data.customer) {
      comment.avatar = data.customer.avatarUrl;
      comment.nickName = data.customer.nickName;
    } else {
      comment.avatar = '/images/icons/customer.png';
      comment.nickName = '微信用户';
    }

    comment.comment = data.comment;
    return comment;
  }

  /**
   * 计算支持的物流方式价格（根据商品信息及地址信息）
   */
  static queryPostPrice (address, goodsList) {
    const url = `${this.baseUrl}/delivery`;
    const param = {
      address: address,
      goodsList: goodsList
    };
    return this.post(url, param).then(data => {
      if (data.delilveryList && data.delilveryList.length > 0) {
        data.delilveryList.forEach(item => {
          item.fee = item.fee.toFixed(2);
        });
      }
      return data;
    });
  }
  /** ********************* 工具方法 ***********************/

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
    if (param && param.reduce) {
      reduceFee = param.reduce.fee;
      finalPrice -= reduceFee;
      if (finalPrice < 0) {
        finalPrice = 0;
      }
    }
    finalPrice = finalPrice.toFixed(2);
    // 构造交易对象
    const trade = {
      orderType: param.orderType,
      dealPrice: price.toFixed(2),
      reduceFee: reduceFee,
      finalPrice: finalPrice,
      postFee: (0).toFixed(2),
      paymentType: '1',
      paymentText: '在线支付',
      orderGoodsInfos: orderGoodsInfos,
      shopName: this.shopName
    };
    if (param.orderType == '30') {
      trade.arriveTime = '立即出餐';
    }
    return trade;
  }

  /**
   * 构建一个交易对象（单个物品），商品页面直接下单
   */
  static createSingleTrade (goods, num = 1, sku) {
    const imageUrl = this._processSingleOrderImageUrl(goods, sku);
    const skuText = this._processOrderSku(sku.skuText);
    const price = sku && sku.price ? sku.price : goods.sellPrice;
    const dealPrice = this._fixedPrice(price * num);
    // 构造交易对象
    return {
      dealPrice: dealPrice,
      finalPrice: dealPrice,
      paymentType: '1',
      paymentText: '在线支付',
      orderGoodsInfos: [
        {
          goodsId: goods.id,
          goodsName: goods.name,
          goodsSku: sku.skuText,
          skuText: skuText,
          imageUrl: imageUrl,
          goodsPrice: price,
          count: num
        }
      ],
      shopName: this.shopName
    };
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
    // const basic = [ACTIONS.AGAIN];
    // 有退款的情况
    if (order.curRefund) {
      basic.push(ACTIONS.REFUND_DETAIL);
    }
    const key = `${order.orderType}-${order.paymentType}-${order.status}`;
    const actions = ACTION_MAP[key];
    if (actions) {
      const display = inner ? actions.filter(v => v.inner != true) : actions;
      order.actions = basic.concat(display);
    } else {
      order.actions = basic;
    }
  }

  /**
   * 梳理订单图片（单独下单）
   */
  static _processSingleOrderImageUrl (goods, seletedSku) {
    if (seletedSku && seletedSku.imageUrl) {
      return seletedSku.imageUrl;
    } else {
      const hasImage = goods.images && goods.images.length > 0;
      return hasImage ? goods.images[0].url : null;
    }
  }

  /**
   * 处理订单地址
   */
  static _processOrderAddress (order, address) {
    if (order.orderType == '20') {
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
  }

  /**
   * 处理订单支付方式
   */
  static _processOrderPaymentText (detail) {
    detail.paymentText = this.paymentDict[detail.paymentType];
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
    const status = order.status;
    order.statusText = this.statusDict[status];
    order.statusDesc = this.statusDesc[status];
    // 到店特殊状态
    if (order.orderType != '20' && status == 3) {
      order.statusText = '店家配餐中';
      order.statusDesc = '店家努力配餐中，请耐心等待';
    }
    // 订单关闭
    if (order.status == 7 && order.orderCloseNote) {
      const reason = order.orderCloseNote;
      order.statusDesc = `订单已关闭，关闭原因：${reason.note}`;
    }
  }
  /**
   * 处理物流配送信息
   */
  static _processOrderDetailDelivery (order) {
    // const price = order.postFee == 0 ? '免邮' : '￥' + order.postFee;
    order.deliveryText = this.deliveryText[order.deliveryType];
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
    order.isAction = true;
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
    // 展现第一个退款记录
    const refund = refunds[refunds.length - 1];
    // 曾经退款过，就一定需要展现退款记录
    order.isAction = true;
    // 控制展现退款详情字段
    order.isRefund = true;
    // 取出第一条退款记录
    order.curRefund = refund;
  }

  /**
   * 处理订单商品信息
   */
  static _processOrderGoods (goods) {
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
