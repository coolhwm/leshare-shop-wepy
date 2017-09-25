import shop from '../api/shop';
import goods from '../api/goods';
import coupon from '../api/coupon';

export default class Cache {
  static cache = new Map();
  static _debug = false;

  /**
   *  优惠信息
   */
  static async reduce(reload = false) {
    const KEY = 'REDUCE_RULE';
    if (reload || this.isExpired(KEY)) {
      const info = await shop.reduces();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 目前卡券信息（已领取/未领取）
   */
  static async coupon(reload = false) {
    const KEY = 'COUPON_SHELF';
    if (reload || this.isExpired(KEY)) {
      const info = await coupon.shelf();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }

  /**
   * 获取店铺信息（缓存）
   */
  static async shop() {
    const KEY = 'SHOP_INFO';
    if (this.isExpired(KEY)) {
      const info = await shop.info();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 获取状态缓存
   */
  static async status() {
    const KEY = 'SHOP_STATUS';
    if (this.isExpired(KEY)) {
      const info = await shop.getStatus();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 获取公告信息
   */
  static async notices() {
    const KEY = 'SHOP_NOTICES';
    if (this.isExpired(KEY)) {
      const info = await shop.notices();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 获取店铺分类
   */
  static async categories() {
    const KEY = 'GOODS_CATEGORIES';
    if (this.isExpired(KEY)) {
      const info = await goods.categories();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 判断是否过期
   */
  static isExpired(key, minute = 5) {
    const value = this.cache.get(key);
    if (value == null) {
      this.log(`[cache]${key} not exists`);
      return true;
    }
    const interval = new Date().getTime() - value._lastupdate;
    const isExpired = interval > minute * 60 * 1000;
    if (isExpired) {
      this.log(`[cache]${key} expired, interval=${interval}`);
      this.cache.delete(key);
    } else {
      this.log(`[cache]${key} exists, interval=${interval}`);
    }
    return isExpired;
  }

  /**
   * 删除缓存对象
   */
  static remove(key) {
    if (key == null) {
      return;
    }
    this.cache.delete(key);
  }

  /**
   * 设置缓存
   */
  static set(key, value) {
    if (key == null) {
      return;
    }
    value._lastupdate = new Date().getTime();
    this.cache.set(key, value);
  }
  static log(text) {
    if (this._debug) {
      console.info(text);
    }
  }
}
