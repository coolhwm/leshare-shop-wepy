import wepy from 'wepy';
import base from './base';
import order from "./order";

export default class booking extends base {
  /***
   * 创建预约
   */
  static booking(param) {
    const url = `${this.baseUrl}/booking`;
    return this.post(url, param);
  }
}
