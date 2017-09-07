
import base from './base';

export default class shop extends base {
  /**
   * 获取店铺信息
   */
  static async info() {
    const url = `${this.baseUrl}/shops`;
    return await this.get(url);
  }

  /**
   * 获取店铺状态
   */
  static async getStatus() {
    const url = `${this.baseUrl}/shops/status`;
    const data = await this.get(url);
    // 文本转换
    data.timeText = `周一至周日 ${data.beginTime}至${data.endTime}`;
    if (data.status == 'CLOSE') {
      data.closeTips = '店铺已休息，请稍后再来';
    } else if (data.status == 'NORMAL' && !data.open) {
      data.closeTips = `店铺已休息，营业时间：${data.beginTime} - ${data.endTime}`;
    }
    return data;
  }

  /**
   * 获取店铺公告（第一个）
   */
  static async notices() {
    const url = `${this.baseUrl}/notices`;
    const data = await this.get(url);
    return data == null || data.length < 1 ? [{ content: '暂无公告' }] : data;
  }
}
