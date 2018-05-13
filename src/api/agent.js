import base from './base';
import Page from '../utils/Page';

export default class goods extends base {

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
    return this.get(url);
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
  static agentDetail (agentId) {
    const url = `${this.baseUrl}/agent/details/${agentId}`;
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
  static agentOrder (agentId) {
    const url = `${this.baseUrl}/agent/orders/${agentId}`;
    return new Page(url);
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

  /** ********************* 数据处理方法 ***********************/
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
  static _processDetail(data) {
    // 处理时间
    this._processCreateTime(data);
    // 处理价格
    this._processPrice(data);
    return data;
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
    data.time = data.inviteTime.slice(0, 10);
  }

  /***
   * 处理佣金
   */
  static _processPrice(data) {
    data.costFee = data.costFee.toFixed(2);
    data.leftFee = data.leftFee.toFixed(2);
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
    item.costFee = data.cashFee.toFixed(2);
    item.leftFee = data.leftCash.toFixed(2);
    const CASH_STATUS = {
      AUDITTING: '待审核',
      SUCCESS: '已提现',
      FAIL: '已驳回'
    };
    item.typeDesc = CASH_STATUS[data.status];
    item.type = 'cash'
  }
}
