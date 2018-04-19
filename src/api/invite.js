import base from './base';
import Page from '../utils/Page';

export default class invite extends base {
  /**
   * 查询邀请列表
   */
  static page () {
    let url = `${this.baseUrl}/members/invite/list`;
    return new Page(url, this._processInvite.bind(this));
  }
  /**
   * 查询邀请总人数
   */
  static count () {
    const url = `${this.baseUrl}/members/invite/count`;
    return this.post(url);
  }
  static _processInvite(data) {
    if (data.inviteeCustomer == null) {
      data.inviteeCustomer = {
        nickName: '微信好友',
        avatarUrl: 'http://img.leshare.shop/shop/other/customer_white.png'
      }
    }
  }
}
