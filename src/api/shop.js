
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
    return data;
  }
}
