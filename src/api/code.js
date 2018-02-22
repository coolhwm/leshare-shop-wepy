import base from './base';

/**
 * 获取二维码
 */
export default class code extends base {
  static getCode (openId, page) {
    const url = `${this.baseUrl}/qr_code/ma?sence=${openId}&page=${page}`;
    return this.get(url)
  }
}
