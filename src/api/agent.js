import base from './base';
import api from "./group";
import Page from "../utils/Page";

export default class goods extends base {
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
    return new Page(url);
  }

  /***
   * 查看分销员子代理列表
   */
  static agentCash (param) {
    const url = `${this.baseUrl}/agent/cash`;
    return this.post(url, param);
  }

  /** ********************* 数据处理方法 ***********************/
  static _processAgent(data) {
    // 处理分销状态
    const AGENT_STATUS = {
      AUDITTING: '待审核',
      ENABLE: '生效中',
      DISABLE: '已失效'
    };
    data.statusText = AGENT_STATUS[data.status];
    return data;
  }
}
