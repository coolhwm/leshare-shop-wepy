import base from './base';
import api from './group';
import Page from '../utils/Page';

export default class booking extends base {
  /***
   * 创建预约
   */
  static booking(param) {
    const url = `${this.baseUrl}/booking`;
    return this.post(url, param);
  }

  /**
   * 返回预约列表
   */
  static list (status) {
    const url = `${this.baseUrl}/booking/list?status=${status}`;
    return new Page(url, item => {
      this._processBookingListItem(item);
    });
  }

  /***
   * 预约取消
   */
  static cancel (id) {
    const url = `${this.baseUrl}/booking/status/cancel`;
    return this.post(url, {id: id});
  }

  // 处理数据

  // 预定列表
  static _processBookingListItem (data) {
    // 处理预览图
    if (data.goods) {
      api._processGoodsPreview(data);
    }
    return data;
  }
}
