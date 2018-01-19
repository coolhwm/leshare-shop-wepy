
import base from './base';

export default class express extends base {
  /**
   * 查询快递公司列表
   */
  static async company() {
    const url = `${this.baseUrl}/express/company`;
    return await this.get(url);
  }
  /**
   * 构造当前物流状态
   */
  static createCurrentTrace(express) {
    if (express == null) {
      return;
    }
    const steps = express.expressBases;
    if (steps == null || steps.length < 1) {
      return { text: '尚未查询到物流信息' };
    }
    const currentStep = steps[0];
    return {
      text: currentStep.status,
      timestape: currentStep.time
    };
  }

  /**
   * 查询订单当前的物流状态
   */
  static queryCurrentTrace(orderId) {
    return this._queryExpressInfo(orderId).then(express => {
      return this.createCurrentTrace(express);
    });
  }

  /**
   * 构造订单跟踪李彪
   */
  static createTrace(express) {
    if (express == null) {
      return;
    }
    const info = this._createExpressInfo(express);
    const steps = this._createTraceSteps(express);
    return {
      steps: steps,
      info: info
    };
  }

  /**
   * 查询订单跟踪列表
   */
  static queryTrace(orderId) {
    return this._queryExpressInfo(orderId).then(data => this.createTrace(data));
  }

  /** ********************* 对象构造方法 ***********************/
  /**
   * 创建物流页面展现的基本信息
   */
  static createExpressOrderPreview(order) {
    const imageUrl = order.orderGoodsInfos[0].imageUrl;
    const goodsCount = order.orderGoodsInfos.length;
    return {
      imageUrl: imageUrl,
      goodsCount: goodsCount,
      orderId: order.orderId
    }
  }

  /** ********************* 数据处理方法 ***********************/
  /**
   * 查询物流信息
   */

  static _queryExpressInfo(orderId) {
    const url = `${this.baseUrl}/express`;
    const param = { order_id: orderId };
    return this.get(url, param);
  }

  /**
   * 提取步骤信息
   */
  static _createTraceSteps(data) {
    if (!data.expressBases) {
      return null;
    }

    // 映射每个步骤
    const steps = data.expressBases.map(this._processTraceStep);

    // 改变最后一个状态
    const lastStep = steps[0];
    lastStep.done = true;
    lastStep.current = true;

    return steps;
  }

  /**
   *  处理每个步骤
   */
  static _processTraceStep(item) {
    return {
      text: item.status,
      timestape: item.time,
      done: false,
      current: false
    };
  }

  /**
   * 提取物流基本信息
   */
  static _createExpressInfo(data) {
    if (data.status == null) {
      data.status = '待揽收';
    }
    return {
      expTextName: data.expressType,
      mailNo: data.expressNo,
      status: data.status,
      tel: data.telPhone
    }
  }
}
