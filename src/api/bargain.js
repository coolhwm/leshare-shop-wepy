import base from './base';
import api from '../api/group';
import wepy from 'wepy';
import order from './order'
import Page from '../utils/Page';
import goods from './goods'

export default class bargain extends base {
  /***
   * 根据拼团商品规则ID查找拼团信息(商品)
   */
  static rule (ruleId) {
    if (ruleId == null && ruleId == undefined) {
      return;
    }
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

  /***
   * 砍价完成下单
   */
  static order (trade, address) {
    const url = `${this.baseUrl}/goods_bargain/order`;
    order._processOrderAddress(trade, address);
    const param = {
      ruleId: trade.ruleId,
      order: trade,
      id: trade.id
    };
    return this.post(url, param);
  }

  /***
   * 虚拟商品砍价完成下单
   */
  static digitOrder (trade) {
    const url = `${this.baseUrl}/goods_bargain/order`;
    const param = {
      ruleId: trade.ruleId,
      order: trade,
      id: trade.id
    };
    return this.post(url, param);
  }

  /**
   * 返回砍价列表
   */
  static list (status) {
    const url = `${this.baseUrl}/goods_bargain/bargain_list?status=${status}`;
    return new Page(url, item => {
      this._processBargainListItem(item);
    });
  }

  /***
   * 查看砍价商品列表
   */
  static bargainGoodsList () {
    const url = `${this.baseUrl}/goods_bargain/rules/list`;
    return new Page(url, item => {
      goods._processGoodsPreview(item.goods);
    });
  }

  /**
   * 推荐列表
   */
  static recommendList() {
    const url = `${this.baseUrl}/goods_bargain/rules/list`;
    return this.get(url).then(data => {
      data.forEach(item => {
        goods._processGoodsPreview(item.goods);
      });
      return data;
    })
  }
  // 处理方法
  static _processBargainGoods (data) {
    // 处理预览图
    goods._processGoodsPreview(data.rule.goods);
    // 筛选规格
    this._processDetail(data);
    // 筛选开砍者
    this._processBargainUser(data);
    // 处理价格
    this._processPrice(data);
    // 处理帮砍价格提示
    this._processHelpText(data);
    return data;
  }

  static _processBargainListItem (data) {
    // 砍价订单动作
    this._processAction(data);
    return data;
  }

  // 处理详情信息
  static _processDetail (data) {
    data.rule.skuDetail = data.rule.skuDetails.find(item => item.sku === data.sku);
    if (data.createTime == null) return;
    data.createTime = data.createTime.replace(/-/g, '/');
  }

  // 处理砍价用户
  static _processBargainUser (data) {
    const { id: userId } = wepy.$instance.globalData.auth['user'];
    const details = data.details;
    // 处理发起者
    data.header = details[0];
    // 是否为发起人
    data.isHead = userId === data.header.customer.id;
    const self = details.find(item => item.customer.id === userId);
    // 是否已经砍价
    data.isHelp = self != null;
    // 自己砍了多少钱
    console.info(`[bargain] userId=${userId}, self=`);
    if (data.isHelp) {
      data.reducePrice = self.reducePrice;
    }
  }

  // 处理砍价价格
  static _processPrice (data) {
    // 一共砍了多少钱
    data.allPrice = (data.details.reduce((prev, current) => prev + current.reducePrice, 0)).toFixed(2);
    let goodsPrice = '';
    if (data.rule.skuDetail != null) {
      goodsPrice = data.rule.skuDetail.price;
    } else {
      goodsPrice = data.rule.goodsPrice;
    }
    // 砍价省多少钱
    if (data.rule.skuDetail != null) {
      data.disparityPrice = (data.rule.skuDetail.price * 1 - data.rule.floorPrice * 1).toFixed(2)
    } else {
      data.disparityPrice = (data.rule.goodsPrice * 1 - data.rule.floorPrice * 1).toFixed(2)
    }
    // 剩余多少钱
    data.balance = (goodsPrice * 1 - data.allPrice * 1).toFixed(2);
    // 砍价的百分比
    data.bargainRate = (data.balance / goodsPrice) * 100;
    // 是否已至底价
    data.isFloor = data.balance == data.rule.floorPrice;
  }

  // 处理我的砍价动作
  static _processAction (data) {
    const BARGAIN_ACTION_NAME = {
      PROCESSING: '找人帮砍',
      BARGAINED: '立即购买',
      TIMEOUT: '再砍一单',
      ORDERED: '查看订单'
    };
    const BARGAIN_ACTION_FUNCNAME = {
      PROCESSING: 'help',
      BARGAINED: 'buy',
      TIMEOUT: 'again',
      ORDERED: 'order'
    };
    const action = {};
    action.name = BARGAIN_ACTION_NAME[data.status];
    action.funcName = BARGAIN_ACTION_FUNCNAME[data.status];
    data.action = action
  }
  // 处理帮砍价格提示
  static _processHelpText(data) {
    if (data.isHelp) {
      if (data.reducePrice > 10) {
        data.helpText = `您一出手就帮好友砍掉了${data.reducePrice}元，功力了得啊~`;
      } else if (data.reducePrice > 1) {
        data.helpText = `您太棒了！一出手就帮好友砍掉了${data.reducePrice}元！`;
      } else {
        data.helpText = `您一出手就帮好友砍掉了${data.reducePrice}元，下次可以换个姿势试一试！`;
      }
    } else if (data.isFloor) {
      data.helpText = `该商品已砍至底价，快去通知您的好友下单购买吧！`
    }
  }
}
