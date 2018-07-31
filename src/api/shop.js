import base from './base';
import wepy from 'wepy';
import Page from '../utils/Page';

export default class shop extends base {

  /**
   * 访问店铺
   */
  static visit(customScene, scene) {
    const url = `${this.baseUrl}/visit_shops`;
    wepy.getSystemInfo().then(res => {
      res.customScene = customScene;
      res.scene = scene;
      return this.post(url, res);
    }).then(_ => {});
  }

  /**
   * 获取店铺信息
   */
  static async info() {
    const url = `${this.baseUrl}/shops`;
    return await this.get(url).then(data => this._processInfo(data));
  }
  /**
   * 获取店铺类型
   */
  static type() {
  }
  /**
   * 获取店铺状态
   */
  static async getStatus() {
    const url = `${this.baseUrl}/shops/status`;
    return this.get(url).then(data => this._processStatus(data));
  }
  /**
   * 判断店铺是否营业
   */
  static async isStatusOpen() {
    const url = `${this.baseUrl}/shops/status`;
    const {open} = await this.get(url);
    return open;
  }

  /**
   * 获取店铺公告（第一个）
   */
  static notices() {
    const url = `${this.baseUrl}/notices`;
    return this.get(url).then(data => this._processNotices(data));
  }
  /**
   * 查询满减信息
   */
  static reduces() {
    const url = `${this.baseUrl}/reduce_rule`;
    return this.get(url).then(data => this._processReduce(data));
  }

  /**
   * 上报FORM
   */
  static reportFormId(id, delay = 3000) {
    if (id == 'the formId is a mock one') {
      return;
    }
    try {
      const url = `${this.baseUrl}/visit_shops/form_id`;
      const param = [{
        formId: id
      }];
      if (delay > 0) {
        setTimeout(() => {
          this.post(url, param, false);
        }, delay);
      } else {
        this.post(url, param, false);
      }
    } catch (e) {
      console.warn('formid上报错误', e);
    }
  }
  /**
   * 签到记录信息
   */
  static signList(memberId) {
    const url = `${this.baseUrl}/member_sign?member_id=${memberId}`;
    return this.get(url);
  }
  /**
   * 签到
   */
  static sign(memberId) {
    const url = `${this.baseUrl}/member_sign?member_id=${memberId}`;
    return this.post(url);
  }
  /**
   * 签到历史记录
   */
  static signHistory() {
    const url = `${this.baseUrl}/member_sign/history`;
    return new Page(url, this._processSignData.bind(this));
  }

  /***
   * 子商户列表
   */
  static subShopList() {
    const url = `${this.baseUrl}/shops/sub_shop_list`;
    const page = new Page(url);
    page.method = 'POST';
    return page;
  }
  /***
   * 推荐子商户列表
   */
  static RecommendationShopList() {
    const url = `${this.baseUrl}/shops/sub_shop_list?from=0&limit=5`;
    return this.get(url);
  }
  /***
   * 子商户图文详情
   */
  static subShopDetail(subShopId) {
    const url = `${this.baseUrl}/shops/details?sub_shop_id=${subShopId}`;
    return this.get(url);
  }

  /***
   * 子商户信息详情
   */
  static subShopInfo(subShopId) {
    const url = `${this.baseUrl}/shops/sub_shop/${subShopId}`;
    return this.get(url);
  }

  /***
   * 子商户商品详情
   */
  static goodsList(subShopId) {
    const url = `${this.baseUrl}/goods/list?sub_shop_id=${subShopId}&is_new=1`;
    return this.get(url)
  }
  /***
   * 子商户商品详情
   */
  static subShopGoodsList(subShopId) {
    const url = `${this.baseUrl}/goods/sub_shop/list?sub_shop_id=${subShopId}&is_new=1&from=0&limit=10&by=sales_volume`;
    return this.get(url).then(data => {
      data.forEach(item => {
        item.isPrice = true
        item.isGoodsName = true
      })
      return data
    })
  }
  /***
   * 子商户标签
   */
  static subShopTag() {
    const url = `${this.baseUrl}/shops/shop_tag`;
    return this.get(url);
  }

  /***
   * 弹出框规则
   */
  static popupsRules() {
    const url = `${this.baseUrl}/popups/rules`;
    return this.get(url).then(data => {
      if (data) {
        data.targetId = data.target
        return data
      }
    });
  }

  /***
   * 更新弹出框
   */
  static popupsResults(resultId) {
    const url = `${this.baseUrl}/popups/results?result_id=${resultId}`;
    return this.post(url);
  }

  // *** 数据处理方法
  /**
   * 处理基本信息
   */
  static _processInfo(data) {
    data.type = this.type();
    return data;
  }
  /**
   * 处理状态
   */
  static _processStatus(data) {
    if (data.beginTime == null || data.endTime == null) {
      return;
    }
    // 文本转换
    data.timeText = `周一至周日 ${data.beginTime}至${data.endTime}`;
    if (data.status == 'CLOSE') {
      data.closeTips = '店铺已休息，请稍后再来';
    } else if (data.status == 'NORMAL' && !data.open) {
      data.closeTips = '店铺已休息，请稍后再来';
    }
    return data;
  }
  /**
   * 处理满减
   */
  static _processReduce(data) {
    data.forEach(item => {
      item.showText = `满${item.limitPrice}减${item.fee}`;
    });
    const showText = data.map(v => v.showText).join(',');
    return {
      list: data, showText
    }
  }
  /**
   * 处理公告
   */
  static _processNotices(data) {
    return data == null || data.length < 1 ? [{ content: '暂无公告' }] : data;
  }
  /**
   * 处理签到历史记录数据
   */
  static _processSignData(item) {
    const sign = {};
    sign.createTime = item.createTime;
    if (item.bonusType == 0) {
      sign.typeDesc = '积分';
      sign.addBonus = item.bonusResult;
    } else {
      sign.typeDesc = '优惠券';
      sign.couponName = item.coupon.name;
    }
    sign.orderId = 0;
    return sign;
  }
}
