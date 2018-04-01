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

  /***
   * 根据预约 ID查找预约详情
   */
  static bookingDetail (id) {
    const url = `${this.baseUrl}/booking/${id}`;
    return this.get(url).then(data => this._processBookingDetail(data));
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
  // 预定列表
  static _processBookingDetail (data) {
    // 处理预览图
    if (data.goods) {
      api._processGoodsPreview(data);
    }
    // 处理预约时间
    this._processServiceTime(data);
    return data;
  }
  // 处理预约时间
  static _processServiceTime (data) {
    data.date = data.serviceTime.slice(0, 10);
    data.time = data.serviceTime.slice(11, 20);
  }
}
