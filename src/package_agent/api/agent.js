import base from '../../api/base';
import Page from '../../utils/Page';
import goods from '../../api/goods';
import order from '../../api/order';
import Lang from '../../utils/Lang';

export default class agent extends base {

  /**
   * 申请
   */
  static invite (parentId) {
    const url = `${this.baseUrl}/agent/invite`;
    return this.post(url, {
      inviteCustomerId: parentId
    });
  }

  /**
   * 规则
   */
  static rule () {
    const url = `${this.baseUrl}/agent/rules`;
    return this.get(url).then(data => this._processRule(data));
  }
  /**
   * 申请
   */
  static apply (param) {
    const url = `${this.baseUrl}/agent/apply`;
    return this.post(url, param);
  }

  /***
   * 查询个人分销信息
   */
  static agentInfo () {
    const url = `${this.baseUrl}/agent`;
    return this.get(url).then(data => this._processAgent(data));
  }

  /***
   * 查看分销员子代理列表
   */
  static agentGroups (agentId) {
    const url = `${this.baseUrl}/agent/list/${agentId}`;
    return new Page(url, item => {
      this._processAgent(item);
    });
  }

  /***
   * 查看佣金信息
   */
  static agentDetail () {
    const url = `${this.baseUrl}/agent/details`;
    return new Page(url, item => {
      this._processDetail(item);
    });
  }

  /***
   * 查看客户列表
   */
  static agentRels (agentId) {
    const url = `${this.baseUrl}/agent/rels/${agentId}`;
    return new Page(url, item => {
      this._processInviteTime(item)
    });
  }

  /***
   * 查看订单列表
   */
  static agentOrder (id) {
    const url = `${this.baseUrl}/agent/orders`;
    return new Page(url, item => {
      this._processOrderListItem(item, id)
    });
  }
  /***
   * 查看订单列表
   */
  static agentOrderId (id, orderId) {
    const url = `${this.baseUrl}/agent/orders/${orderId}`;
    return this.get(url).then(data => this._processOrderListItem(data, id));
  }

  /***
   * 提现
   */
  static agentCash (param) {
    const url = `${this.baseUrl}/agent/cash`;
    return this.post(url, param);
  }
  /***
   * 查询提现信息
   */
  static agentCashDetail (id) {
    const url = `${this.baseUrl}/agent/cash?agent_id=${id}`;
    return new Page(url, item => {
      this._processCashDetail(item)
    });
  }
  /***
   * 查询提现信息
   */
  static orderDetail (id) {
    const url = `${this.baseUrl}/agent/commission_detail?order_id=${id}`;
    return this.get(url).then(data => this._processOrderDetail(data));
  }

  /***
   * 查询商品规则
   */
  static config () {
    const url = `${this.baseUrl}/agent/rules/details`;
    return new Page(url, item => {
      this._processConfig(item)
    });
  }

  /** ********************* 数据处理方法 ***********************/

  /**
   * 处理规则
   */
  static _processRule(data) {
    data.agentRate = `${Lang._fixedPrice((data.agentRate * 100))}%`;
    data.parentRate = `${Lang._fixedPrice((data.parentRate * 100))}%`;
    return data;
  }
  /**
   * 处理代理人信息
   */
  static _processAgent(data) {
    if (data != null) {
      // 处理分销状态
      this._processStatus(data);
      // 处理时间
      this._processCreateTime(data);
      // 处理上级代理人
      this._processParentAgent(data);
    }
    return data;
  }

  /**
   * 处理佣金信息
   */
  static _processDetail(data) {
    // 处理时间
    this._processCreateTime(data);
    // 处理价格
    this._processPrice(data);
    return data;
  }

  /***
   * 处理分销订单列表
   */
  static _processOrderListItem(item, id) {
    if (item.agentId == id) {
      item.fee = Lang._fixedPrice(item.commission);
      item.customerText = `我的客户`;
    } else if (item.parentAgentId == id) {
      item.fee = Lang._fixedPrice(item.parentCommission);
      item.customerText = `${item.agentName}的客户`;
    }
    order._processOrderStatusDesc(item);
    return item;
  }

  /***
   * 处理分销订单明细
   */
  static _processOrderDetail(data) {
    data.forEach(item => {
      item.fee = Lang._fixedPrice(item.fee);
    });
    return data;
  }

  /***
   * 处理商品规则
   */
  static _processConfig(item) {
    if (item.goods) {
      goods._processGoodsPreview(item.goods);
    } else {
      item.goods.imageUrl = ''
    }
    item.goods.sellPrice = Lang._fixedPrice(item.goods.sellPrice);
    item.agentRate = `${Lang._fixedPrice(item.agentRate * 100)}%`;
    item.parentAgentRate = `${Lang._fixedPrice(item.parentAgentRate * 100)}%`;
    return item;
  }

  /***
   * 处理状态
   */
  static _processStatus(data) {
    const AGENT_STATUS = {
      AUDITTING: '审核中，请耐心等待',
      ENABLE: '生效中',
      DISABLE: '申请被拒绝，请联系总店'
    };
    data.statusText = AGENT_STATUS[data.status];
  }

  /***
   * 处理创建时间
   */
  static _processCreateTime(data) {
    data.time = data.createTime.slice(0, 10);
  }

  /***
   * 处理创建时间
   */
  static _processInviteTime(data) {
    if (data.inviteTime) {
      data.time = data.inviteTime.slice(0, 10);
    }
  }

  /***
   * 处理佣金
   */
  static _processPrice(data) {
    data.costFee = Lang._fixedPrice(data.costFee);
    data.leftFee = Lang._fixedPrice(data.leftFee);
  }

  /***
   * 处理上级代理人
   */
  static _processParentAgent(data) {
    if (data.parentAgent != null) {
      data.parentAgentName = data.parentAgent.name
    } else {
      data.parentAgentName = '总店'
    }
  }

  /***
   * 处理提现列表
   */
  static _processCashDetail(item) {
    const data = { ...item };
    item.costFee = Lang._fixedPrice(data.cashFee);
    item.leftFee = Lang._fixedPrice(data.leftCash);
    const CASH_STATUS = {
      AUDITTING: '待审核',
      SUCCESS: '已提现',
      FAIL: '已驳回'
    };
    item.typeDesc = CASH_STATUS[data.status];
    item.type = 'cash'
  }
}
