import base from './base';
import wepy from 'wepy';
import Page from '../utils/Page';
import { TYPE, ACTION, orderUtils as utils } from './order_const';

export default class group extends base {
  /***
   * 根据拼团商品规则ID查找拼团信息(商品)
   */
  static rules (ruleId) {
    const url = `${this.baseUrl}/goods_group/rules/${ruleId}`;
    return this.get(url).then(data => this._processGoodsDetail(data));
  }

  /***
   * 获取商品详情中所展示的拼团信息(3条)
   */
  static processing (ruleId) {
    const url = `${this.baseUrl}/goods_group/processing?rule_id=${ruleId}&sort=asc&by=group_time&limit=3`;
    return this.get(url).then(data => this._processGroupProcessingDetail(data));
  }
  /***
   * 获取正在拼团的拼团信息
   */
  static processingList (ruleId) {
    const url = `${this.baseUrl}/goods_group/processing?rule_id=${ruleId}`;
    return new Page(url, item => {
      this._processGroupProcessingListDetail(item);
    });
  }

  /***
   * 开团/参团
   */
  static goodsGroup (trade, address) {
    const url = `${this.baseUrl}/goods_group`;
    this._processOrderAddress(trade, address);
    const param = {
      ruleId: trade.ruleId,
      order: trade,
      id: trade.groupId
    };
    return this.post(url, param);
  }

  /**
   * 返回参团列表
   */
  static list (status) {
    const url = `${this.baseUrl}/goods_group/list?status=${status}`;
    return new Page(url, item => {
      this._processGroupListItem(item);
    });
  }

  /***
   * 根据拼团ID查找拼团详情
   */
  static groupDetail (groupId) {
    const url = `${this.baseUrl}/goods_group/${groupId}`;
    return this.get(url).then(data => this._processGroupDetail(data));
  }

  // *** 数据处理方法

  /**
   * 处理商品详情
   */
  static _processGoodsDetail (detail) {
    // 解析预览图
    this._processGoodsPreview(detail);

    // 解析SKU规格
    this._processSkuLable(detail);

    // 处理价格范围区间
    this._processGoodsPriceRange(detail);

    // 处理价格标签
    this._processGoodsPriceLabel(detail);

    return detail;
  }

  /***
   * 拼团栏信息处理
   */
  static _processGroupProcessingDetail (detail) {
    if (detail === null) return [];
    detail.forEach(item => {
      // 解析预览图
      this._processGoodsPreview(item.rule);

      // 解析SKU规格
      this._processSkuLable(item.rule);

      // 处理价格范围区间
      this._processGoodsPriceRange(item.rule);

      // 处理价格标签
      this._processGoodsPriceLabel(item.rule);

      // 处理开团时间
      this._processGroupTime(item);

      // 筛选团长
      this._processGroupHeader(item);

      // 判断是否已开团
      this._processGroupParticipated(item);
    });
    return detail;
  }
  /***
   * 正在拼团信息处理
   */
  static _processGroupProcessingListDetail (detail) {
    // 解析预览图
    this._processGoodsPreview(detail.rule);

    // 解析SKU规格
    this._processSkuLable(detail.rule);

    // 处理价格范围区间
    this._processGoodsPriceRange(detail.rule);

    // 处理价格标签
    this._processGoodsPriceLabel(detail.rule);

    // 判断是否已开团
    this._processGroupParticipated(detail);

    // 处理开团时间
    this._processGroupTime(detail);

    // 筛选团长
    this._processGroupHeader(detail);

    return detail;
  }

  /***
   * 拼团详情处理
   */
  static _processGroupDetail (data) {
    const rule = data.rule;
    // 解析预览图
    this._processGoodsPreview(rule);

    // 解析SKU规格
    this._processSkuLable(rule);

    // 处理价格范围区间
    this._processGoodsPriceRange(rule);

    // 处理价格标签
    this._processGoodsPriceLabel(rule);
    // 处理list.length和参团人数一致
    this._processGroupListLength(data, rule);
    return data;
  }

  /**
   * 处理预览图
   */
  static _processGoodsPreview (item) {
    const images = item.goods.images;
    // 图片处理
    if (images == null || images.length < 1) {
      item.goods.imageUrl = '/images/goods/broken.png';
    } else if (images[0].url == null) {
      item.goods.imageUrl = '/images/goods/broken.png';
    } else {
      item.goods.imageUrl = images[0].url + '/medium';
    }
  }

  /**
   * 处理SKU标签
   */
  static _processSkuLable (detail) {
    const skuInfo = detail.goods.goodsSkuInfo;
    if (!skuInfo) {
      return;
    }

    const skuLabels = [];
    for (let i = 1; i <= 5; i++) {
      const skuKey = skuInfo[`prop${i}`];
      const skuValueStr = skuInfo[`value${i}`];
      if (skuKey && skuValueStr) {
        const skuValues = skuValueStr.split(',');
        const sku = {
          key: skuKey,
          value: skuValues
        };
        skuLabels.push(sku);
      } else {
        break;
      }
    }
    detail.goods.labels = skuLabels;
  }

  /**
   * 处理价格商品区间
   */
  static _processGoodsPriceRange (detail) {
    if (!detail.goods.goodsSkuInfo || !detail.goods.goodsSkuInfo.goodsSkuDetails) {
      return;
    }
    const skuDetails = detail.goods.goodsSkuInfo.goodsSkuDetails;
    let maxPrice = 0;
    let minPrice = Number.MAX_VALUE;

    for (let i in skuDetails) {
      const detail = skuDetails[i].goodsSkuDetailBase;
      maxPrice = Math.max(detail.price, maxPrice);
      minPrice = Math.min(detail.price, minPrice);
    }
    detail.goods.maxPrice = maxPrice;
    detail.goods.minPrice = minPrice;
  }

  /**
   * 处理价格展现标签 / 需要先调用区间处理
   */
  static _processGoodsPriceLabel (detail) {
    let priceLable = detail.goods.sellPrice;

    if (detail.goods.maxPrice && detail.goods.minPrice) {
      // priceLable = `${detail.minPrice}~${detail.maxPrice}`;
      priceLable = detail.goods.minPrice;
    }
    detail.goods.priceLable = isNaN(detail.goods.priceLable) ? priceLable : priceLable.toFixed.toFixed(2);
  }

  /***
   * 团长信息处理
   */
  static _processGroupHeader (detail) {
    if (!detail.list) return;
    detail.header = detail.list.find(item => item.head === true);
  }

  /***
   * 开团时间处理
   */
  static _processGroupTime (detail) {
    const time = new Date(detail.groupTime.replace(/-/g, '/')) - new Date() + 1000 * 60 * 60 * 24;
    if (time > 0) {
      let hour = Math.floor(time / 3600000);
      let min = Math.floor((time / 60000) % 60);
      let sec = Math.floor((time / 1000) % 60);
      hour = hour < 10 ? '0' + hour : hour;
      min = min < 10 ? '0' + min : min;
      sec = sec < 10 ? '0' + sec : sec;
      detail.time = `还剩${hour}:${min}:${sec}`;
    } else {
      detail.time = `已结束`;
    }
  }

  /***
   * 判断是否已开团
   */
  static _processGroupParticipated (detail) {
    const user = wepy.getStorageSync('user');
    detail.list.forEach(item => {
      detail.isPar = item.customerId === user.id;
    });
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
  static _processGroupListItem (detail) {
    const order = detail.detail.order;
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

    return detail;
  }

  /**
   * 处理状态描述文本
   */
  static _processOrderStatusDesc (order) {
    const {status, orderType} = order;
    order.statusText = utils.statusName(orderType, status);
    order.statusDesc = utils.statusDesc(order, status);
    // 订单关闭增加关闭原因
    if (order.status === 7 && order.orderCloseNote) {
      const reason = order.orderCloseNote;
      order.statusDesc = `订单已关闭，关闭原因：${reason.note}`;
    }
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
   * 处理订单动作
   */
  static _processOrderAction (order, inner = false) {
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

  static _processOfflinePayment (order) {
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

  /***
   * 处理参团list
   */
  static _processGroupListLength (data, rule) {
    rule.spareCustomer = rule.limitCustomer - data.list.length;
    if (rule.limitCustomer > data.list.length) {
      for (let i = 1; i < rule.limitCustomer; i++) data.list.push({})
    }
  }
}
