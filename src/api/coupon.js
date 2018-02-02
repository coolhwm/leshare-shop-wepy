import base from './base';
import Page from '../utils/Page';

/**
 * 卡券服务类
 */
export default class coupon extends base {
  /**
   * 返回分页对象
   */
  static page () {
    const url = `${this.baseUrl}/coupons?by=accept_time&sort=desc`;
    return new Page(url, this._processCouponItem.bind(this));
  }

  /**
   * 获取可领取、已领取的优惠券
   */
  static all () {
    const url = `${this.baseUrl}/coupons/all`;
    return this.get(url).then(({owned, show}) => {
      const pickCoupons = this.processCouponsList(show, this._processPickItem.bind(this));
      const ownCoupons = this.processCouponsList(owned, this._processCouponItem.bind(this));
      return {pickCoupons, ownCoupons};
    });
  }
  static processCouponsList(data, func) {
    if (data && data.length > 0) {
      return data.map(func);
    } else {
      return [];
    }
  }

  /**
   * 目前可以领取的优惠券
   */
  static list () {
    const url = `${this.baseUrl}/coupons/show`;
    return this.get(url).then(pickList => {
      if (pickList && pickList.length > 0) {
        return pickList.map(this._processPickItem.bind(this));
      } else {
        return [];
      }
    });
  }
  /**
   * 查找目前已领取的优惠券
   */
  static own (status = 'NEVER_USED') {
    const url = `${this.baseUrl}/coupons/list?status=${status}`;
    return this.get(url).then(ownList => {
      if (ownList && ownList.length > 0) {
        return ownList.map(this._processCouponItem.bind(this));
      } else {
        return [];
      }
    });
  }
  /**
   * 领取卡券
   */
  static pick (couponId) {
    const url = `${this.baseUrl}/coupons/${couponId}/get`;
    return this.get(url);
  }
  /**
   * 删除卡券
   */
  static remove (acceptId) {
    const url = `${this.baseUrl}/coupons/${acceptId}`;
    return this.delete(url);
  }
  /**
   * 使用卡券
   */
  static use(id) {
    const url = `${this.baseUrl}/coupons/use/${id}`;
    return this.put(url);
  }

  /**
   * 获取可用的卡券信息
   */
  static available (goodsList) {
    const url = `${this.baseUrl}/coupons/order_available`;
    const param = {orderGoodsInfos: goodsList};
    return this.post(url, param).then(data => {
      return data ? data.map(coupon => this._processCouponItem(coupon)) : [];
    });
  }
  /**
   * 获取活动中的卡券
   */
  static campaign(visit) {
    const url = `${this.baseUrl}/coupons/campaign`;
    return this.post(url, visit);
  }
  /**
   * 处理可以领取的优惠券
   */
  static _processPickItem (coupon) {
    coupon.beginTime = this._convertTimestapeToDay(coupon.beginTime);
    coupon.dueTime = this._convertTimestapeToDay(coupon.dueTime);
    return coupon;
  }
  /**
   * 处理已拥有的优惠券
   */
  static _processCouponItem (data) {
    const root = data;
    if (data.coupon == null) {
      return null;
    }
    const coupon = data.coupon;

    coupon.status = root.status;
    coupon.id = root.id;
    coupon.couponId = root.couponId;
    coupon.acceptTime = root.acceptTime;
    coupon.usedTime = root.usedTime;
    coupon.beginTime = this._convertTimestapeToDay(coupon.beginTime);
    coupon.dueTime = this._convertTimestapeToDay(coupon.dueTime);
    this._processCouponDisplayFlag(coupon);
    return coupon;
  }
  /**
   * 处理卡券展示标签
   */
  static _processCouponDisplayFlag (coupon) {
    if (coupon.status != 'NEVER_USED') {
      return;
    }
    const acceptTimeInterval = this._dayIntervalToNow(coupon.acceptTime);
    if (acceptTimeInterval <= 1) {
      coupon.isNew = true;
    }
    const dueTimeInterval = this._dayIntervalToNow(coupon.dueTime);
    if (dueTimeInterval >= -1) {
      coupon.isExpiring = true;
    }
  }
  /**
   * 计算时间间隔
   */
  static _dayIntervalToNow (dateStr) {
    const MS_OF_DAY = 86400000;
    const date = Date.parse(dateStr);
    return Math.round((Date.now() - date) / MS_OF_DAY);
  }
  /**
   * 处理时间格式
   */
  static _convertTimestapeToDay (timestape) {
    let temp = timestape;
    if (timestape.indexOf(' ') != -1) {
      temp = timestape.substring(0, timestape.indexOf(' '));
    }
    return temp.replace(/-/g, '.');
  }
}
