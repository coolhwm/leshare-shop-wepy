import base from './base';
import Page from '../utils/Page';

export default class invite extends base {
  /**
   * 查询邀请列表
   */
  static page () {
    let url = `${this.baseUrl}/members/invite/list`;
    return new Page(url);
  }
  /**
   * 查询邀请总人数
   */
  static count () {
    const url = `${this.baseUrl}/members/invite/count`;
    return this.post(url);
  }
}
