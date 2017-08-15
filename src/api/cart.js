import base from './base'
// import wepy from 'wepy'
import Page from '../utils/Page'
// import Lang from '../utils/Lang'

/**
 * 购物车服务类
 */
export default class cart extends base {
  /**
   * 返回分页对象
   */
  static page () {
    const url = `${this.baseUrl}/carts`;
    return new Page(url, this._processCartData);
  }
  static async list () {
    const url = `${this.baseUrl}/carts?from=0&limit=100`;
    const list = await this.get(url);
    return list.map(item => this._processCartData(item));

  }

  /**
   * 购物车总数
   */
  static count () {
    const url = `${this.baseUrl}/carts/count`
    return this.get(url).then(data => data.count)
  }

  /**
   * 将商品加入购物车中
   */
  static add (goodsId, num = 1, sku) {
    const url = `${this.baseUrl}/carts`
    const param = {
      goodsId: goodsId,
      goodsSku: sku,
      goodsNum: num
    };
    return this.post(url, param)
  }

  /**
   * 清空购物车
   */
  static clear () {
    const url = `${this.baseUrl}/carts`
    return this.delete(url)
  }

  /**
   * 删除购物车中的商品
   */
  static remove (cartId) {
    const url = `${this.baseUrl}/carts/${cartId}`
    return this.delete(url)
  }

  /**
   * 批量删除购物车商品
   */
  static removeBatch (carts) {
    const url = `${this.baseUrl}/carts/batch`
    const param = carts.map(cart => {
      return {cartId: cart.cartId}
    })
    return this.delete(url, param)
  }

  /**
   * 更新购物车中的商品数量
   */
  static update (cartId, num) {
    const url = `${this.baseUrl}/carts/${cartId}`
    const param = {
      goodsNum: num
    }
    return this.put(url, param)
  }

  /**
   * 处理购物车数据
   */
  static _processCartData (cart) {
    cart.check = true
    cart.goodsPrice = cart.goodsPrice.toFixed(2)
    if (cart.goodsSku) {
      cart.skuText = cart.goodsSku.replace(/:/g, ',')
    }
    if (cart.goodsNum > cart.stock) {
      cart.goodsNum = cart.stock
    }
    cart.goodsImage += '/small'
    return cart;
  }
}
